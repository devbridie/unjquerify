import {
    arrowFunctionExpression, BlockStatement,
    callExpression,
    Expression,
    identifier,
    memberExpression,
    numericLiteral
} from "babel-types";
import {Scope} from "babel-traverse";

/**
 * a => a[0]
 */
export function firstOfArray(node: Expression): Expression {
    return memberExpression(node, numericLiteral(0), true);
}

export type ArrowFunctionWrapper = (firstArg: Expression) => Expression | BlockStatement;

/**
 * a => a.<method>(_element => wrapper(_element))
 */
export function arrayCollector(array: Expression, scope: Scope,
                               method: string, body: ArrowFunctionWrapper): Expression {
    const forEachMember = memberExpression(array, identifier(method));
    const fnArg = scope.generateUidIdentifier("element");
    const fn = arrowFunctionExpression([fnArg], body(fnArg));
    return callExpression(forEachMember, [fn]);
}
