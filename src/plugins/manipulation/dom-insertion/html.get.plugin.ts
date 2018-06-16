import {identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery, pullOutNativeElement} from "../../../util/jquery-heuristics";

export const HtmlGetPlugin: Plugin = {
    name: "HtmlGetPlugin",
    path: ["manipulation", "dom-insertion", "html.get"],
    references: [
        jqueryApiReference("html"),
        mdnReference("Element/innerHTML"),
        youDontNeedJquery("3.3"),
    ],
    fromExample: `$el.html()`,
    toExample: `el.innerHTML`,
    description: `Converts $el.html() calls.`,

    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "html")) return;
                if (node.arguments.length !== 0) return;

                const el = pullOutNativeElement(node.callee.object);
                const innerHTML = memberExpression(el, identifier("innerHTML"));
                path.replaceWith(innerHTML);
            },
        },
    }),
};
