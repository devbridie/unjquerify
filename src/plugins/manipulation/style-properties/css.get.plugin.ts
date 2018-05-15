import * as babel from "babel-core";
import {
    callExpression,
    identifier,
    isIdentifier,
    isMemberExpression,
    isStringLiteral,
    memberExpression,
    nullLiteral,
    stringLiteral,
} from "babel-types";

export const CssGetPlugin = () => ({
    visitor: {
        /*
            $el.css("color") => getComputedStyle(el, null)["color"]
         */
        CallExpression: (path) => {
            const node = path.node;
            if (!isMemberExpression(node.callee)) return;
            if (!(isIdentifier(node.callee.property) && node.callee.property.name === "css")) return;
            if (node.arguments.length !== 1) return;
            const el = memberExpression(node.callee.object, identifier("0"), true); // pull out of jquery;

            const getComputedStyle = identifier("getComputedStyle");
            const computedStyle = callExpression(getComputedStyle, [el, nullLiteral()]);
            const arg = node.arguments[0];
            if (!isStringLiteral(arg)) return; // TODO fix for array type
            const styleIdValue = arg.value;
            const styleIdentifier = stringLiteral(styleIdValue);
            const property = memberExpression(computedStyle, styleIdentifier, true);
            path.replaceWith(property);
        },
    } as babel.Visitor<{}>,
});
