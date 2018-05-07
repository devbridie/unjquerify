import * as babel from "babel-core";

import {isStringLiteral, stringLiteral} from "babel-types";

import {isJQueryWrappedElement, unWrapjQueryElement} from "../../util/jquery-heuristics";

const template = require("@babel/template");

const replaceAstTemplate = template.expression(`$(document.getElementById(IDENTIFIER))`,
    {placeholderPattern: /^[_A-Z0-9]+$/},
);

export const GetElementByIdPlugin = () => ({
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
    } as babel.Visitor<{}>,
});
