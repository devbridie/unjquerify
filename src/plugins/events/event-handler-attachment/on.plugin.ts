import {
    CallExpression,
    callExpression,
    Expression,
    identifier,
    isMemberExpression,
    memberExpression,
    stringLiteral,
} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";
import {NodePath} from "babel-traverse";

function replaceWithAddEventListener(path: NodePath<CallExpression>, eventName: Expression, rest: Expression[]) {
    const node = path.node;
    if (!isMemberExpression(node.callee)) return;

    const el = node.callee.object;
    const addEventListener = memberExpression(el, identifier("addEventListener"));
    const call = callExpression(addEventListener, [eventName, ...rest]);
    path.replaceWith(call);
}

const template = require("@babel/template");

const triggerTemplate = template.expression(`
const EVENTVARIABLENAME = document.createEvent('HTMLEvents');
EVENTVARIABLENAME.initEvent(type, false, true);
ELEMENTREFERENCE.dispatchEvent(EVENTVARIABLENAME);
`,
    {placeholderPattern: /^[_A-Z0-9]+$/},
);

export const OnPlugin: (eventName?: string) => Plugin = (eventName?: string) => ({
    name: "OnPlugin",
    path: ["events", "event-handler-attachment", "on"],
    matchesExpressionType: new CallExpressionOfjQueryCollection("on"),
    causesChainMutation: false,
    references: [
        jqueryApiReference("on"),
        mdnReference("EventTarget/addEventListener"),
        youDontNeedJquery("5.1"),
    ],
    fromExample: `$el.on("click", fn)`,
    toExample: `el.addEventListener("click", fn)`,
    description: `Converts on event calls.`,
    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isMemberExpression(node.callee)) return;
                if (eventName === undefined) {
                    const firstArg = path.node.arguments[0] as Expression;
                    if (!isCallOnjQuery(node, "on")) return;
                    if (node.arguments.length !== 2) return;
                    replaceWithAddEventListener(path, firstArg, path.node.arguments.slice(1) as Expression[]);
                } else {
                    if (!isCallOnjQuery(node, eventName)) return;

                    if (node.arguments.length === 0) { // .click()
                        const el = node.callee.object;
                        const eventIdentifier = path.scope.generateUidIdentifier(eventName);
                        const replacement = triggerTemplate({
                            EVENTVARIABLENAME: eventIdentifier,
                            ELEMENTREFERENCE: el,
                        });
                        path.replaceWithMultiple(replacement);
                    } else if (node.arguments.length === 1) { // .click(e)
                        const rest = [path.node.arguments[0] as Expression];
                        replaceWithAddEventListener(path, stringLiteral(eventName), rest);
                    }
                }
            },
        },
    }),
});
