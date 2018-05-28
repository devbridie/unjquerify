import {isStringLiteral, stringLiteral} from "babel-types";

import {isJQueryWrappedElement, unWrapjQueryElement} from "../../util/jquery-heuristics";
import {Plugin} from "../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../util/references";

const template = require("@babel/template");

const replaceAstTemplate = template.expression(`$(document.getElementById(IDENTIFIER))`,
    {placeholderPattern: /^[_A-Z0-9]+$/},
);

export const GetElementByIdPlugin: Plugin = {
    name: "GetElementByIdPlugin",
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
                if (!isJQueryWrappedElement(path.node)) return;
                const unwrapped = unWrapjQueryElement(path.node);
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
