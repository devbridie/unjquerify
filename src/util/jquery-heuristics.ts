import {
    CallExpression,
    Expression,
    identifier,
    isCallExpression,
    isIdentifier,
    isMemberExpression,
    MemberExpression,
    memberExpression,
    Node,
} from "babel-types";

function isjQueryIdentifier(expr: Expression) {
    if (!isIdentifier(expr)) return false;
    const name = expr.name;
    return name === "jQuery" || name === "$";
}

/**
 * Pulls out the first argument to a jQuery call expression.
 * If the node is not a jQuery call expression, returns false.
 * @param {Node} node
 * @returns {Node}
 */
export function unWrapjQueryElement(node: Node): false | Expression {
    if (!isCallExpression(node)) return false;
    const callee = node.callee;
    const isJqueryCallee = isjQueryIdentifier(callee);
    if (!isJqueryCallee) return false;
    return node.arguments[0] as Expression;
}

/**
 * Pulls out the first element in a jQuery-wrapped DOM collection.
 * Effectively $el => $el[0].
 */
export function pullOutNativeElement(node: Expression): Expression {
    return memberExpression(node, identifier("0"), true);
}

/**
 * Returns false if `node` cannot be statically determined to be a jQuery instance.
 * @param {Expression} node the node to check.
 */
export function isjQueryInstance(node: Expression): boolean {
    if (unWrapjQueryElement(node)) return true;
    if (isIdentifier(node)) return true;
    // TODO this should probably contain some tree marking, but the approach is unclear for now.
    if (isCallOnjQuery(node)) return true;
    return false;
}

export interface CallOnjQueryExpression extends CallExpression {
    callee: MemberExpression;
}

/**
 * Returns true if the expression can be statically determined to be a method call on a jQuery instance
 * with a given name.
 */
export function isCallOnjQuery(node: Expression, name?: string): node is CallOnjQueryExpression {
    if (!isCallExpression(node)) return false;
    const callee = node.callee;
    if (!isMemberExpression(callee)) return false;
    const obj = callee.object;
    if (!isjQueryInstance(obj)) return false;
    const property = callee.property;
    if (!isIdentifier(property)) return false;
    if (name && property.name !== name) return false;
    return true;
}
