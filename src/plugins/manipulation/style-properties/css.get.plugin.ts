import {callExpression, identifier, isStringLiteral, memberExpression, nullLiteral, stringLiteral} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery} from "../../../util/jquery-heuristics";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";

export const CssGetPlugin: Plugin = {
    name: "CssGetPlugin",
    path: ["manipulation", "style-properties", "css.get"],
    matchesExpressionType: new CallExpressionOfjQueryCollection("css"),
    causesChainMutation: false,
    references: [
        jqueryApiReference("css"),
        mdnReference("Window/getComputedStyle"),
        youDontNeedJquery("2.1"),
    ],
    fromExample: `$el.css("background-color")`,
    toExample: `getComputedStyle(el, null)["background-color"]`,
    description: `Converts css get calls.`,
    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "css")) return;
                if (node.arguments.length !== 1) return;
                const el = node.callee.object;

                const getComputedStyle = identifier("getComputedStyle");
                const computedStyle = callExpression(getComputedStyle, [el, nullLiteral()]);
                const arg = node.arguments[0];
                if (!isStringLiteral(arg)) return; // TODO fix for array type
                const styleIdValue = arg.value;
                const styleIdentifier = stringLiteral(styleIdValue);
                const property = memberExpression(computedStyle, styleIdentifier, true);
                path.replaceWith(property);
            },
        },
    }),
};
