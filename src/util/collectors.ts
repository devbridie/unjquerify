import {
    arrowFunctionExpression,
    callExpression,
    Expression, Identifier,
    identifier,
    memberExpression,
    numericLiteral,
} from "babel-types";

/**
 * a => a[0]
 */
export function firstOfArray(node: Expression): Expression {
    return memberExpression(node, numericLiteral(0), true);
}

/**
 * a => a.<method>(_element => wrapper(_element))
 */
export function arrayCollector(array: Expression,
                               method: string, parameter: Identifier,
                               body: (parameter: Expression) => Expression): Expression {
    const forEachMember = memberExpression(array, identifier(method));
    const fn = arrowFunctionExpression([parameter], body(parameter));
    return callExpression(forEachMember, [fn]);
}
