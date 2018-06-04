import {
    CallExpression,
    callExpression,
    Expression,
    identifier,
    isIdentifier,
    isMemberExpression,
    memberExpression,
    stringLiteral,
} from "babel-types";
import {NodePath} from "babel-traverse";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {pullOutNativeElement} from "../../../util/jquery-heuristics";

function replaceWithAddEventListener(path: NodePath<CallExpression>, eventName: Expression, rest: Expression[]) {
    const node = path.node;
    if (!isMemberExpression(node.callee)) return;

    const el = pullOutNativeElement(node.callee.object);
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

                    if (!(isIdentifier(node.callee.property) && node.callee.property.name === "on")) return;
                    if (node.arguments.length !== 2) return;
                    replaceWithAddEventListener(path, firstArg, path.node.arguments.slice(1) as Expression[]);
                } else {
                    if (!(isIdentifier(node.callee.property) && node.callee.property.name === eventName)) return;

                    if (node.arguments.length === 0) {
                        const el = pullOutNativeElement(node.callee.object);
                        const eventIdentifier = path.scope.generateUidIdentifier(eventName);
                        const replacement = triggerTemplate({
                            EVENTVARIABLENAME: eventIdentifier,
                            ELEMENTREFERENCE: el,
                        });
                        path.replaceWithMultiple(replacement);
                    } else if (node.arguments.length === 1) {
                        const rest = [path.node.arguments[0] as Expression];
                        replaceWithAddEventListener(path, stringLiteral(eventName), rest);
                    }
                }
            },
        },
    }),
});
