import {Plugin} from "../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../model/matchers/call-expression-of-jquery-collection";
import {callExpression, identifier, memberExpression,} from "babel-types";
import {ReturnValue} from "../../model/return-types/return-value";

export const HasClassPlugin: Plugin = {
    returnType: new ReturnValue(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("hasClass"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [clz]) => {
        const classList = memberExpression(element, identifier("classList"));
        const contains = memberExpression(classList, identifier("contains"));
        return callExpression(contains, [clz]);
    },
};
