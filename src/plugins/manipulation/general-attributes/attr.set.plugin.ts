import {assignmentExpression, callExpression, identifier, memberExpression, stringLiteral} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";
import {arrayCollector} from "../../../util/collectors";
import {continueChainOnVoid} from "../../../util/chain";

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

                const arr = node.callee.object;
                continueChainOnVoid(path, arr, (elements) => {
                    return arrayCollector(elements, path.scope, "forEach", (element) => {
                        const getAttribute = memberExpression(element, identifier("setAttribute"));
                        return callExpression(getAttribute, [property, value]);
                    });
                });
            },
        },
    }),
};
