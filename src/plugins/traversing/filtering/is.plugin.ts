import {callExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnValue} from "../../../model/return-types/return-value";
import {arrayCollector} from "../../../util/collectors";

export const IsPlugin: Plugin = {
    returnType: new ReturnValue(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("is"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [selector], scope) => {
        return arrayCollector(element, "some", scope.generateUidIdentifier("element"), e => {
            const matches = memberExpression(e, identifier("matches"));
            return callExpression(matches, [selector]);
        });
    },
};
