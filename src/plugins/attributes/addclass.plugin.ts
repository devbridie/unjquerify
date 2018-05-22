import * as babel from "babel-core";
import {
    callExpression,
    identifier,
    isIdentifier,
    isMemberExpression,
    isStringLiteral,
    memberExpression,
    stringLiteral,
} from "babel-types";

export const AddClassPlugin = () => ({
    visitor: {
        /*
            $el.addClass(className) => el.classList.add(className)
         */
        CallExpression: (path) => {
            const node = path.node;
            if (!isMemberExpression(node.callee)) return;
            if (!(isIdentifier(node.callee.property) && node.callee.property.name === "addClass")) return;
            if (node.arguments.length !== 1) return;
            const firstArg = node.arguments[0];
            if (!isStringLiteral(firstArg)) return;
            const el = memberExpression(node.callee.object, identifier("0"), true); // pull out of jquery;

            const classList = memberExpression(el, identifier("classList"));
            const add = memberExpression(classList, identifier("add"));
            const classes = firstArg.value.split(" ");
            const call = callExpression(add, classes.map(name => stringLiteral(name)));
            path.replaceWith(call);
        },
    } as babel.Visitor<{}>,
});
