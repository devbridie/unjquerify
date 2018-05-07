import * as babel from "babel-core";
import {
    callExpression,
    identifier,
    isIdentifier,
    isMemberExpression,
    memberExpression,
    nullLiteral,
    StringLiteral,
} from "babel-types";

// TODO fix broken behavior on background-color
export const CssGetPlugin = () => ({
    visitor: {
        /*
            $el.css("color") => el.style.color
         */
        CallExpression: (path) => {
            const node = path.node;
            if (!isMemberExpression(node.callee)) return;
            if (isIdentifier(node.callee.property) && node.callee.property.name !== "css") return;
            const el = memberExpression(node.callee.object, identifier("0"), true); // pull out of jquery;

            // construct el.ownerDocument.defaultView
            const ownerDocument = memberExpression(el, identifier("ownerDocument"));
            const defaultView = memberExpression(ownerDocument, identifier("defaultView"));
            const getComputedStyle = memberExpression(defaultView, identifier("getComputedStyle"));
            const computedStyle = callExpression(getComputedStyle, [el, nullLiteral()]);
            const styleIdentifier = identifier((node.arguments[0] as StringLiteral).value); // TODO fix bad cast
            const property = memberExpression(computedStyle, styleIdentifier);
            path.replaceWith(property);
        },
    } as babel.Visitor<{}>,
});
