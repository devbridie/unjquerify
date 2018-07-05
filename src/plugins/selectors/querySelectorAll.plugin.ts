import {callExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../model/plugin";
import {CallExpressionOfjQueryGlobal} from "../../model/matchers/call-expression-of-jquery-global";
import {ReturnMutatedJQuery} from "../../model/return-types/return-mutated-jQuery";

export const QuerySelectorAllPlugin: Plugin = {
    returnType: new ReturnMutatedJQuery(),
    matchesExpressionType: new CallExpressionOfjQueryGlobal(),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [arg]) => {
        const document = identifier("document");
        const querySelectorAll = memberExpression(document, identifier("querySelectorAll"));
        return callExpression(querySelectorAll, [arg]);
    },
};
