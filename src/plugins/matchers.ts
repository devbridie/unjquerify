import {CallOnjQueryExpression, isCallOnjQuery, isjQueryIdentifier} from "../util/jquery-heuristics";
import {
    CallExpression,
    Expression,
    Identifier,
    isCallExpression,
    isMemberExpression,
    MemberExpression
} from "babel-types";

export interface JQueryGlobalMemberExpression extends MemberExpression {
    object: Identifier;
    property: Identifier;
}

export interface CallExpressionOfjQueryGlobalMemberExpression extends CallExpression {
    callee: JQueryGlobalMemberExpression;
}

// Shaped like $.a();
export function matchesCallExpressionOfjQueryGlobalMember(expression: Expression):
    expression is CallExpressionOfjQueryGlobalMemberExpression {
    if (!isCallExpression(expression)) return false;
    const callee = expression.callee;
    if (!isMemberExpression(callee)) return false;
    if (!isjQueryIdentifier(callee.object)) return false;
    return true;
}

// Shaped like $(...)
export function matchesCallExpressionOfjQueryGlobal(expression: Expression): boolean {
    if (!isCallExpression(expression)) return false;
    const callee = expression.callee;
    if (!isjQueryIdentifier(callee)) return false;
    return true;
}

// Shaped like $(...).a();
export function matchesCallExpressionOfjQueryCollection(expression: Expression): expression is CallOnjQueryExpression {
    return isCallOnjQuery(expression);
}
