import {isStringLiteral} from "babel-types";

import {unWrapjQueryElement} from "../../util/jquery-heuristics";
import {Plugin} from "../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../util/references";
import {CallExpressionOfjQueryGlobal} from "../../model/call-expression-of-jquery-global";

const template = require("@babel/template");

const replaceAstTemplate = template.expression(`$(document.body)`,
    {placeholderPattern: /^[_A-Z0-9]+$/},
);

export const BodyPlugin: Plugin = {
    name: "BodyPlugin",
    path: ["selectors", "body"],
    causesChainMutation: false,
    matchesExpressionType: new CallExpressionOfjQueryGlobal(),
    references: [
        jqueryApiReference("jQuery"),
        mdnReference("Document/body"),
        youDontNeedJquery("1.10"),
    ],
    fromExample: `$("body")`,
    toExample: `$(document.body)`,
    description: `Converts $("body") calls.`,

    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const unwrapped = unWrapjQueryElement(path.node);
                if (!unwrapped) return;
                if (!isStringLiteral(unwrapped)) return;
                if (unwrapped.value !== "body") return;

                path.replaceWith(replaceAstTemplate());
            },
        },
    }),
};
