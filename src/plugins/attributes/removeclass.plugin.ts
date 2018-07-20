import {Plugin} from "../../model/plugin";
import {ReturnSelf} from "../../model/return-types/return-self";
import {CallExpressionOfjQueryCollection} from "../../model/matchers/call-expression-of-jquery-collection";
import {
    arrowFunctionExpression,
    callExpression,
    identifier,
    isStringLiteral,
    memberExpression,
    spreadElement,
    StringLiteral,
    stringLiteral,
} from "babel-types";

export const RemoveClassPlugin: Plugin = {
    returnType: new ReturnSelf(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("removeClass"),
    applicableWithArguments: (args) => args.length === 0 || args.length === 1,
    replaceWith: (element, [classes], scope) => {
        const classList = memberExpression(element, identifier("classList"));
        const remove = memberExpression(classList, identifier("remove"));
        if (classes === undefined) {
            const lambdaParam = scope.generateUidIdentifier("clz");
            const forEach = memberExpression(classList, identifier("forEach"));
            const lambda = arrowFunctionExpression([lambdaParam], callExpression(remove, [lambdaParam]));
            return callExpression(forEach, [lambda]);
        } else {
            if (isStringLiteral(classes)) {
                const classLiteral = classes as StringLiteral;
                const split = classLiteral.value.split(" ");
                return callExpression(remove, split.map(s => stringLiteral(s)));
            } else {
                const split = memberExpression(classes, identifier("split"));
                const splitCall = callExpression(split, [stringLiteral(" ")]);
                return callExpression(remove, [spreadElement(splitCall)]);
            }
        }
    },
};
