import {callExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnMutatedJQuery} from "../../../model/return-types/return-mutated-jQuery";

export const FindPlugin: Plugin = {
    returnType: new ReturnMutatedJQuery(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("find"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [selector]) => {
        const querySelectorAll = memberExpression(element, identifier("querySelectorAll"));
        return callExpression(querySelectorAll, [selector]);
        // const concat = memberExpression(arrayExpression(), identifier("concat"));
        // const flatMapCall = callExpression(concat, [spreadElement(map)]);
    },
};
