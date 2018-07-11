import {Statement} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnSelf} from "../../../model/return-types/return-self";

const template = require("@babel/template");

const replaceAstTemplate = template.statements(`
    const LISTENER_ID = LISTENER_FUNCTION;
    if (document.readyState !== 'loading') {
        LISTENER_ID();
    } else {
        document.addEventListener('DOMContentLoaded', LISTENER_ID);
    }
`);

export const ReadyPlugin: Plugin = {
    returnType: new ReturnSelf(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("ready"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [arg], scope) => {
        return replaceAstTemplate({
            LISTENER_FUNCTION: arg,
            LISTENER_ID: scope.generateUidIdentifier("onLoadListener"),
        }) as Statement[];
    },
    escapeFromChain: true,
};
