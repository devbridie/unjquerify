import {callExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnMutatedJQuery} from "../../../model/return-types/return-mutated-jQuery";

export const IsPlugin: Plugin = {
    // returnType: new ReturnValue((array, scope, singleElement) =>
    // arrayCollector(array, scope, "some", singleElement)),
    returnType: new ReturnMutatedJQuery(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("is"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [selector]) => {
        const matches = memberExpression(element, identifier("matches"));
        return callExpression(matches, [selector]);
    },
};
