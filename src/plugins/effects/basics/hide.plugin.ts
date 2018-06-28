import {
    assignmentExpression, callExpression,
    identifier,
    memberExpression,
    stringLiteral,
} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";
import {continueChainOnVoid} from "../../../util/chain";
import {arrayCollector} from "../../../util/collectors";

export const HidePlugin: Plugin = {
    name: "HidePlugin",
    path: ["effects", "basics", "hide"],
    causesChainMutation: false,
    matchesExpressionType: new CallExpressionOfjQueryCollection("hide"),
    references: [
        jqueryApiReference("hide"),
        mdnReference("Element/classList"),
        mdnReference("HTMLElement/style"),
        youDontNeedJquery("8.1"),
    ],
    fromExample: `$el.hide()`,
    toExample: `el.style.display = "none"`,
    description: `Converts $el.hide() calls.`,
    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "hide")) return;
                if (node.arguments.length !== 0) return;

                const arr = node.callee.object;
                continueChainOnVoid(path, arr, (elements) => {
                    return arrayCollector(elements, path.scope, "forEach", (element) => {
                        const style = memberExpression(element, identifier("style"));
                        const display = memberExpression(style, identifier("display"));
                        return assignmentExpression("=", display, stringLiteral("none"));
                    });
                });
            },
        },
    }),
};
