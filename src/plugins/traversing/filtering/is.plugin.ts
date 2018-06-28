import {callExpression, identifier, memberExpression} from "babel-types";

import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";
import {arrayCollector} from "../../../util/collectors";

export const IsPlugin: Plugin = {
    name: "IsPlugin",
    path: ["traversing", "filtering"],
    causesChainMutation: false,
    matchesExpressionType: new CallExpressionOfjQueryCollection("is"),
    references: [
        jqueryApiReference("is"),
        mdnReference("Element/matches"),
        youDontNeedJquery("3.8"),
    ],
    fromExample: `$el.is(selectorString)")`,
    toExample: `el.matches(selectorString)`,
    description: `Converts $el.is(string) calls.`,
    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "is")) return;
                if (node.arguments.length !== 1) return;

                const array = node.callee.object;
                const wrapper = arrayCollector(array, path.scope, "some", (element) => {
                    const matches = memberExpression(element, identifier("matches"));
                    return callExpression(matches, [node.arguments[0]]);
                });
                path.replaceWith(wrapper);
            },
        },
    }),
};
