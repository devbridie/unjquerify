import {callExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../model/plugin";
import {CallExpressionOfjQueryGlobal} from "../../model/matchers/call-expression-of-jquery-global";
import {ReturnValue} from "../../model/return-types/return-value";

export const QuerySelectorAllPlugin: Plugin = {
    returnType: new ReturnValue(),
    matchesExpressionType: new CallExpressionOfjQueryGlobal(),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [arg]) => {
        const document = identifier("document");
        const querySelectorAll = memberExpression(document, identifier("querySelectorAll"));
        return callExpression(querySelectorAll, [arg]);
    },
};
