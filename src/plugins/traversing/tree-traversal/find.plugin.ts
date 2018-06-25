import {callExpression, identifier, memberExpression} from "babel-types";

import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";

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
                const el = node.callee.object;

                const matches = memberExpression(el, identifier("querySelectorAll"));
                const call = callExpression(matches, [node.arguments[0]]);
                path.replaceWith(call);
            },
        },
    }),
};
