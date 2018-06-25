import {callExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";

export const AttrSetPlugin: Plugin = {
    name: "AttrSetPlugin",
    path: ["manipulation", "general-attributes", "attr.set"],
    causesChainMutation: false,
    matchesExpressionType: new CallExpressionOfjQueryCollection("attr"),
    references: [
        jqueryApiReference("attr"),
        mdnReference("Element/setAttribute"),
        youDontNeedJquery("1.11"),
    ],
    fromExample: `$el.attr("foo", "bar")`,
    toExample: `el.setAttribute("foo", "bar")`,
    description: `Converts calls for attribute set.`,
    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "attr")) return;
                if (node.arguments.length !== 2) return;
                const property = node.arguments[0];
                const value = node.arguments[1];
                const el = node.callee.object;
                const getAttribute = memberExpression(el, identifier("setAttribute"));
                const callWithArg = callExpression(getAttribute, [property, value]);
                path.replaceWith(callWithArg);
            },
        },
    }),
};
