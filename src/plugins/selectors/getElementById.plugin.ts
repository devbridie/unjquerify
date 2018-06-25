import {isStringLiteral, stringLiteral} from "babel-types";

import {unWrapjQueryElement} from "../../util/jquery-heuristics";
import {Plugin} from "../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../util/references";
import {CallExpressionOfjQueryGlobal} from "../../model/call-expression-of-jquery-global";

const template = require("@babel/template");

const replaceAstTemplate = template.expression(`$(document.getElementById(IDENTIFIER))`,
    {placeholderPattern: /^[_A-Z0-9]+$/},
);

export const GetElementByIdPlugin: Plugin = {
    name: "GetElementByIdPlugin",
    path: ["selectors", "getElementById"],
    causesChainMutation: false,
    matchesExpressionType: new CallExpressionOfjQueryGlobal(),
    references: [
        jqueryApiReference("jQuery"),
        mdnReference("Document/getElementById"),
        youDontNeedJquery("1.2"),
    ],
    fromExample: `$("#<id>")`,
    toExample: `$(document.getElementById("<id>"))`,
    description: `Converts $("#<id>") calls.`,

    babel: () => ({
        visitor: {
            /*
                $("#...") => $(document.getElementById("..."))
             */
            CallExpression: (path) => {
                const unwrapped = unWrapjQueryElement(path.node);
                if (!unwrapped) return;
                if (!isStringLiteral(unwrapped)) return;

                const literal = unwrapped.value;
                if (!/^#[a-zA-Z0-9]+$/.test(literal)) return;
                const id = literal.slice(1);
                const newLiteral = stringLiteral(id);
                path.replaceWith(replaceAstTemplate({IDENTIFIER: newLiteral}));
            },
        },
    }),
};
