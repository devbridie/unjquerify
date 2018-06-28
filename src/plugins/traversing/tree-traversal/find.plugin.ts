import {arrayExpression, callExpression, identifier, memberExpression, spreadElement} from "babel-types";

import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";
import {arrayCollector} from "../../../util/collectors";

export const FindPlugin: Plugin = {
    name: "FindPlugin",
    path: ["traversing", "tree-traversal"],
    causesChainMutation: true,
    matchesExpressionType: new CallExpressionOfjQueryCollection("find"),
    references: [
        jqueryApiReference("find"),
        mdnReference("Element/querySelectorAll"),
        youDontNeedJquery("1.4"),
    ],
    fromExample: `$el.find(selectorString)")`,
    toExample: `el.querySelectorAll(selectorString)`,
    description: `Converts $el.find(string) calls.`,
    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "find")) return;
                if (node.arguments.length !== 1) return;

                const arr = node.callee.object;
                const map = arrayCollector(arr, path.scope, "map", (element) => {
                    const matches = memberExpression(element, identifier("querySelectorAll"));
                    return callExpression(matches, [node.arguments[0]]);
                });

                const concat = memberExpression(arrayExpression(), identifier("concat"));
                const flatMapCall = callExpression(concat, [spreadElement(map)]);
                path.replaceWith(flatMapCall);
            },
        },
    }),
};
