import {assignmentExpression, identifier, isExpression, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";

export const HtmlSetPlugin: Plugin = {
    name: "HtmlSetPlugin",
    path: ["manipulation", "dom-insertion", "html.set"],
    causesChainMutation: false,
    matchesExpressionType: new CallExpressionOfjQueryCollection("html"),
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

                const el = node.callee.object;
                const innerHTML = memberExpression(el, identifier("innerHTML"));
                const assignment = assignmentExpression("=", innerHTML, firstArg);
                path.replaceWith(assignment);
            },
        },
    }),
};
