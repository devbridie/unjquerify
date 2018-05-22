import * as babel from "babel-core";
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

function replaceWithAddEventListener(path: NodePath<CallExpression>, eventName: Expression, rest: Expression[]) {
    const node = path.node;
    if (!isMemberExpression(node.callee)) return;

    const el = memberExpression(node.callee.object, identifier("0"), true); // pull out of jquery;
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

export const OnPlugin = (eventName?: string) => () => ({
    visitor: {
        /*
            $el.on(eventName, fn) => el.addEventListener(eventName, fn);
         */
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
                    const el = memberExpression(node.callee.object, identifier("0"), true); // pull out of jquery;
                    const eventIdentifier = path.scope.generateUidIdentifier(eventName);
                    const replacement = triggerTemplate({
                        EVENTVARIABLENAME: eventIdentifier,
                        ELEMENTREFERENCE: el,
                    });
                    path.replaceWithMultiple(replacement);
                } else if (node.arguments.length === 1) {
                    replaceWithAddEventListener(path, stringLiteral(eventName), [path.node.arguments[0] as Expression]);
                }
            }

        },
    } as babel.Visitor<{}>,
});
