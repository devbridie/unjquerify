import {assignmentExpression, identifier, memberExpression, stringLiteral} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";

export const EmptyPlugin: Plugin = {
    name: "EmptyPlugin",
    path: ["manipulation", "dom-removal", "empty"],
    causesChainMutation: false,
    matchesExpressionType: new CallExpressionOfjQueryCollection("empty"),
    references: [
        jqueryApiReference("empty"),
        mdnReference("Element/innerHTML"),
        youDontNeedJquery("3.10"),
    ],
    fromExample: `$el.empty()`,
    toExample: `el.innerHTML = ''`,
    description: `Converts $el.empty() calls.`,

    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "empty")) return;
                if (node.arguments.length !== 0) return;

                const el = node.callee.object;
                const innerHTML = memberExpression(el, identifier("innerHTML"));
                const assignment = assignmentExpression("=", innerHTML, stringLiteral(""));
                path.replaceWith(assignment);
            },
        },
    }),
};
