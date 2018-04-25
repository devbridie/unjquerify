import * as babel from "babel-core";

import * as types from "babel-types";
import {stringLiteral} from "babel-types";

import * as util from "../util/jquery-heuristics";

const template = require("@babel/template");

const replaceAstTemplate = template.expression(`$(document.getElementById(IDENTIFIER))`,
    {placeholderPattern: /^[_A-Z0-9]+$/},
);

export default () => ({
    visitor: {
        /*
            $("#...") => $(document.getElementById("..."))
         */
        CallExpression: (path) => {
            if (!util.isJQueryWrappedElement(path.node)) {
                return;
            }
            const unwrapped = util.unWrapjQueryElement(path.node);
            if (!types.isStringLiteral(unwrapped)) {
                return;
            }
            if (!/#[a-zA-Z0-9]+/.test(unwrapped.value)) {
                return;
            }
            console.log('Found replacement candidate $("' + unwrapped.value + '")');

            const id = stringLiteral(unwrapped.value.slice(1));
            path.replaceWith(replaceAstTemplate({IDENTIFIER: id}));
        },
    } as babel.Visitor<{}>,
});
