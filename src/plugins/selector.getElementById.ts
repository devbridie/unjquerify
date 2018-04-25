import * as babel from "babel-core";

import * as types from "babel-types";
import {callExpression, identifier, memberExpression, stringLiteral} from "babel-types";

import * as util from "../util/jquery-heuristics";

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
            const getElementById = memberExpression(identifier("document"), identifier("getElementById"));
            path.replaceWith(
                callExpression(identifier("$"), [
                    callExpression(getElementById, [id]),
                ]),
            );
        },
    } as babel.Visitor<{}>,
});
