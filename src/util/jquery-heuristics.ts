import * as types from "babel-types";
import {CallExpression, Node} from "babel-types";

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
    if (callee.type !== "Identifier" || !isjQueryIdentifier(callee.name)) {
        return false;
    }
    return true;
}

/**
 * Pulls out the first argument to a jQuery call expression.
 * @param {Node} node
 * @returns {Node}
 */
export function unWrapjQueryElement(node: Node): Node {
    if (!isJQueryWrappedElement(node)) {
        throw Error(`${node} is not a valid jQuery wrapped element.`);
    }
    return (node as CallExpression).arguments[0];
}
