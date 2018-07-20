import {arrowFunctionExpression, callExpression, identifier, isStringLiteral, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {firstOfArray} from "../../../util/collectors";
import {ReturnValue} from "../../../model/return-types/return-value";
import {arrayFrom} from "../../../util/babel";

export const IndexPlugin: Plugin = {
    returnType: new ReturnValue(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("index"),
    applicableWithArguments: (args) => args.length === 0 || args.length === 1,
    replaceWith: (element, [selector], scope) => {
        if (selector) {
            const array = arrayFrom(element);
            if (isStringLiteral(selector)) {
                const findIndex = memberExpression(array, identifier("findIndex"));
                const param = scope.generateUidIdentifier("element");
                const matches = memberExpression(param, identifier("matches"));
                const matchesCall = callExpression(matches, [selector]);
                const lambda = arrowFunctionExpression([param], matchesCall);
                return callExpression(findIndex, [lambda]);
            } else {
                const indexOf = memberExpression(array, identifier("indexOf"));
                return callExpression(indexOf, [firstOfArray(selector)]);
            }
        } else {
            const first = firstOfArray(element);
            const parent = memberExpression(first, identifier("parentNode"));
            const parentChildren = memberExpression(parent, identifier("children"));
            const indexOf = memberExpression(arrayFrom(parentChildren), identifier("indexOf"));
            return callExpression(indexOf, [first]);
        }
    },
};
