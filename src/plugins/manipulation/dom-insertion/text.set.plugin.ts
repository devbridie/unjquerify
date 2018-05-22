import * as babel from "babel-core";
import {
    assignmentExpression,
    Expression,
    identifier,
    isIdentifier,
    isMemberExpression,
    memberExpression,
} from "babel-types";

export const TextSetPlugin = () => ({
    visitor: {
        /*
            $el.text("abc") => el.textContent = "abc"
         */
        CallExpression: (path) => {
            const node = path.node;
            if (!isMemberExpression(node.callee)) return;
            if (!(isIdentifier(node.callee.property) && node.callee.property.name === "text")) return;
            if (node.arguments.length !== 1) return;
            const firstArg = node.arguments[0] as Expression;

            const el = memberExpression(node.callee.object, identifier("0"), true); // pull out of jquery;
            const textContent = memberExpression(el, identifier("textContent"));
            const assignment = assignmentExpression("=", textContent, firstArg);
            path.replaceWith(assignment);
        },
    } as babel.Visitor<{}>,
});
