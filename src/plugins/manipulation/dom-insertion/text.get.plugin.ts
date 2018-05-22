import * as babel from "babel-core";
import {identifier, isIdentifier, isMemberExpression, memberExpression} from "babel-types";

export const TextGetPlugin = () => ({
    visitor: {
        /*
            $el.text() => el.textContent
         */
        CallExpression: (path) => {
            const node = path.node;
            if (!isMemberExpression(node.callee)) return;
            if (!(isIdentifier(node.callee.property) && node.callee.property.name === "text")) return;
            if (node.arguments.length !== 0) return;
            const el = memberExpression(node.callee.object, identifier("0"), true); // pull out of jquery;
            const textContent = memberExpression(el, identifier("textContent"));
            path.replaceWith(textContent);
        },
    } as babel.Visitor<{}>,
});
