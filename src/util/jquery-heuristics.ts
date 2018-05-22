import * as types from "babel-types";
import {CallExpression, Expression, isIdentifier, Node} from "babel-types";

const isjQueryIdentifier = (name: string) => {
    return name === "jQuery" || name === "$";
};

/**
 * Returns `true` if the node is of the shape $(<expression>).
 * @param {Node} node
 * @returns {boolean}
 */
export function isJQueryWrappedElement(node: Node): boolean {
    if (!types.isCallExpression(node)) {
        return false;
    }
    const callee = (node as CallExpression).callee;
    return (isIdentifier(callee) && isjQueryIdentifier(callee.name));
}

/**
 * Pulls out the first argument to a jQuery call expression.
 * @param {Node} node
 * @returns {Node}
 */
export function unWrapjQueryElement(node: Node): Expression {
    if (!isJQueryWrappedElement(node)) {
        throw Error(`${node} is not a valid jQuery wrapped element.`);
    }
    return (node as CallExpression).arguments[0] as Expression;
}
