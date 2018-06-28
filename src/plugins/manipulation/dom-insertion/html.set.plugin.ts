import {assignmentExpression, identifier, isExpression, memberExpression, stringLiteral} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";
import {continueChainOnVoid} from "../../../util/chain";
import {arrayCollector} from "../../../util/collectors";

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

                const arr = node.callee.object;
                continueChainOnVoid(path, arr, (elements) => {
                    return arrayCollector(elements, path.scope, "forEach", (element) => {
                        const innerHTML = memberExpression(element, identifier("innerHTML"));
                        return assignmentExpression("=", innerHTML, firstArg);
                    });
                });
            },
        },
    }),
};
