import {
    assignmentExpression,
    identifier,
    isIdentifier,
    isMemberExpression,
    memberExpression,
    stringLiteral,
} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {pullOutNativeElement} from "../../../util/jquery-heuristics";

export const HidePlugin: Plugin = {
    name: "HidePlugin",
    references: [
        jqueryApiReference("hide"),
        mdnReference("Element/classList"),
        mdnReference("HTMLElement/style"),
        youDontNeedJquery("8.1"),
    ],
    fromExample: `$el.hide()`,
    toExample: `el.style.display = "none"`,
    description: `Converts $el.hide() calls.`,
    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isMemberExpression(node.callee)) return;
                if (!(isIdentifier(node.callee.property) && node.callee.property.name === "hide")) return;
                if (node.arguments.length !== 0) return;

                const el = pullOutNativeElement(node.callee.object);
                const style = memberExpression(el, identifier("style"));
                const display = memberExpression(style, identifier("display"));
                const assignment = assignmentExpression("=", display, stringLiteral("none"));
                path.replaceWith(assignment);
            },
        },
    }),
};
