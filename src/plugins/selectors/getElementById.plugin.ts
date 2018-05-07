import * as babel from "babel-core";

import {isStringLiteral, stringLiteral} from "babel-types";

import {some} from "fp-ts/lib/Option";
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
            some(path.node)
                .filter(node => isJQueryWrappedElement(node))
                .map(wrapped => unWrapjQueryElement(wrapped))
                .mapNullable(unwrapped => isStringLiteral(unwrapped) ? unwrapped : null)
                .map(literal => literal.value)
                .filter(selector => /^#[a-zA-Z0-9]+$/.test(selector))
                .map(cssId => cssId.slice(1))
                .map(id => stringLiteral(id))
                .map(literal => {
                    path.replaceWith(replaceAstTemplate({IDENTIFIER: literal}));
                });
        },
    } as babel.Visitor<{}>,
});