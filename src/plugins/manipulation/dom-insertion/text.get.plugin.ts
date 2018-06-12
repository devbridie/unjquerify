import * as babel from "babel-core";
import {identifier, isIdentifier, isMemberExpression, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {pullOutNativeElement} from "../../../util/jquery-heuristics";

export const TextGetPlugin: Plugin = {
    name: "TextGetPlugin",
    path: ["manipulation", "dom-insertion", "text.get"],
    references: [
        jqueryApiReference("text"),
        mdnReference("Node/textContent"),
        youDontNeedJquery("3.2"),
    ],
    fromExample: `$el.text()`,
    toExample: `el.textContent`,
    description: `Converts $el.text() calls.`,

    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isMemberExpression(node.callee)) return;
                if (!(isIdentifier(node.callee.property) && node.callee.property.name === "text")) return;

                if (node.arguments.length !== 0) return;
                const el = pullOutNativeElement(node.callee.object);
                const textContent = memberExpression(el, identifier("textContent"));
                path.replaceWith(textContent);
            },
        } as babel.Visitor<{}>,
    }),
};
