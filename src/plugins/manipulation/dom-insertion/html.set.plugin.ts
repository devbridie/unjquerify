import {assignmentExpression, identifier, isExpression, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery, pullOutNativeElement} from "../../../util/jquery-heuristics";

export const HtmlSetPlugin: Plugin = {
    name: "HtmlSetPlugin",
    path: ["manipulation", "dom-insertion", "html.set"],
    references: [
        jqueryApiReference("html"),
        mdnReference("Element/innerHTML"),
        youDontNeedJquery("3.3"),
    ],
    fromExample: `$el.html("abc")`,
    toExample: `el.innerHTML = "abc"`,
    description: `Converts $el.html(...) calls.`,

    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "html")) return;

                if (node.arguments.length !== 1) return;
                const firstArg = node.arguments[0];
                if (!isExpression(firstArg)) return;

                const el = pullOutNativeElement(node.callee.object);
                const innerHTML = memberExpression(el, identifier("innerHTML"));
                const assignment = assignmentExpression("=", innerHTML, firstArg);
                path.replaceWith(assignment);
            },
        },
    }),
};
