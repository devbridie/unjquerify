import {
    callExpression,
    Expression,
    identifier,
    isMemberExpression,
    memberExpression,
    stringLiteral,
} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {CallOnjQueryExpression, isCallOnjQuery} from "../../../util/jquery-heuristics";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";
import {NodePath} from "babel-traverse";
import {continueChainOnVoid} from "../../../util/chain";
import {arrayCollector} from "../../../util/collectors";

function replaceWithAddEventListener(path: NodePath<CallOnjQueryExpression>, eventName: Expression,
                                     rest: Expression[]) {
    const node = path.node;
    const el = node.callee.object;
    continueChainOnVoid(path, el, (elements) => {
        return arrayCollector(elements, path.scope, "forEach", (element) => {
            const addEventListener = memberExpression(element, identifier("addEventListener"));
            return callExpression(addEventListener, [eventName, ...rest]);
        });
    });
}

const template = require("@babel/template");

const initEventTemplate = template.expression(`
const EVENTVARIABLENAME = document.createEvent('HTMLEvents');
EVENTVARIABLENAME.initEvent(type, false, true);
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
                    replaceWithAddEventListener(path as NodePath<CallOnjQueryExpression>, firstArg,
                        path.node.arguments.slice(1) as Expression[]);
                } else {
                    if (!isCallOnjQuery(node, eventName)) return;
                    const pathC = path as NodePath<CallOnjQueryExpression>;

                    if (node.arguments.length === 0) { // .click()
                        const el = node.callee.object;
                        const eventIdentifier = path.scope.generateUidIdentifier(eventName);
                        const replacement = initEventTemplate({
                            EVENTVARIABLENAME: eventIdentifier,
                        });
                        path.insertBefore(replacement);
                        continueChainOnVoid(path, el, (elements) => {
                            return arrayCollector(elements, path.scope, "forEach", (element) => {
                                const dispatchEvent = memberExpression(element, identifier("dispatchEvent"));
                                return callExpression(dispatchEvent, [eventIdentifier]);
                            });
                        });
                    } else if (node.arguments.length === 1) { // .click(e)
                        const rest = [path.node.arguments[0] as Expression];
                        replaceWithAddEventListener(pathC, stringLiteral(eventName), rest);
                    }
                }
            },
        },
    }),
});
