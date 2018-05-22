import * as babel from "babel-core";
import {
    assignmentExpression,
    identifier,
    isIdentifier,
    isMemberExpression,
    memberExpression,
    stringLiteral,
} from "babel-types";

export const HidePlugin = () => ({
    visitor: {
        /*
            $el.hide() => el.style.display = "none";
         */
        CallExpression: (path) => {
            const node = path.node;
            if (!isMemberExpression(node.callee)) return;
            if (!(isIdentifier(node.callee.property) && node.callee.property.name === "hide")) return;
            if (node.arguments.length !== 0) return;

            const el = memberExpression(node.callee.object, identifier("0"), true); // pull out of jquery;
            const style = memberExpression(el, identifier("style"));
            const display = memberExpression(style, identifier("display"));
            const assignment = assignmentExpression("=", display, stringLiteral("none"));
            path.replaceWith(assignment);
        },
    } as babel.Visitor<{}>,
});
