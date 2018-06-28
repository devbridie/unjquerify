import {identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";
import {firstOfArray} from "../../../util/collectors";

export const HtmlGetPlugin: Plugin = {
    name: "HtmlGetPlugin",
    path: ["manipulation", "dom-insertion", "html.get"],
    causesChainMutation: false,
    matchesExpressionType: new CallExpressionOfjQueryCollection("html"),
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

                const el = firstOfArray(node.callee.object);
                const innerHTML = memberExpression(el, identifier("innerHTML"));
                path.replaceWith(innerHTML);
            },
        },
    }),
};
