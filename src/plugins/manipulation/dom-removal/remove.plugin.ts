import {assignmentExpression, callExpression, identifier, memberExpression, stringLiteral} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";
import {arrayCollector} from "../../../util/collectors";
import {continueChainOnVoid} from "../../../util/chain";

export const RemovePlugin: Plugin = {
    name: "RemovePlugin",
    path: ["manipulation", "dom-removal", "remove"],
    causesChainMutation: false,
    matchesExpressionType: new CallExpressionOfjQueryCollection("remove"),
    references: [
        jqueryApiReference("remove"),
        mdnReference("Node/removeChild"),
        youDontNeedJquery("3.1"),
    ],
    fromExample: `$el.remove()`,
    toExample: `el.parentNode.removeChild(el)`,
    description: `Converts $el.remove() calls.`,

    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "remove")) return;

                if (node.arguments.length !== 0) return; // TODO write args == 1 case

                const arr = node.callee.object;
                continueChainOnVoid(path, arr, (elements) => {
                    return arrayCollector(elements, path.scope, "forEach", (el) => {
                        const parentNode = memberExpression(el, identifier("parentNode"));
                        const removeChild = memberExpression(parentNode, identifier("removeChild"));
                        return callExpression(removeChild, [el]);
                    });
                });
            },
        },
    }),
};
