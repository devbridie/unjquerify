import {assignmentExpression, identifier, isSpreadElement, isStringLiteral, memberExpression,} from "babel-types";
import camelcase from "camelcase";
import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";
import {arrayCollector} from "../../../util/collectors";
import {continueChainOnVoid} from "../../../util/chain";

export const CssSetPlugin: Plugin = {
        name: "CssSetPlugin",
        path: ["manipulation", "style-properties", "css.set"],
        matchesExpressionType: new CallExpressionOfjQueryCollection("css"),
        causesChainMutation: false,
        references: [
            jqueryApiReference("css"),
            mdnReference("HTMLElement/style"),
            youDontNeedJquery("2.1"),
        ],
        fromExample: `$el.css("color", "red")`,
        toExample: `el.style.color = "red"`,
        description: `Converts css set calls.`,

        babel: () => ({
            visitor: {
                CallExpression: (path) => {
                    const node = path.node;
                    if (!isCallOnjQuery(node, "css")) return;

                    const [firstArg, secondArg] = path.node.arguments;
                    if (!(isStringLiteral(firstArg) && secondArg)) return;

                    const arr = node.callee.object;

                    if (isStringLiteral(firstArg) && !isSpreadElement(secondArg)) {
                        continueChainOnVoid(path, arr, (elements) => {
                            return arrayCollector(elements, path.scope, "forEach", (element) => {
                                const style = memberExpression(element, identifier("style"));
                                const propertyName = firstArg.value;
                                const property = memberExpression(style, identifier(camelcase(propertyName)));
                                return assignmentExpression("=", property, secondArg);
                            });
                        });
                    }
                },
            },
        }),
    }
;
