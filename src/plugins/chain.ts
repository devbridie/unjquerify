import {
    CallExpression,
    Expression,
    isCallExpression,
    isIdentifier,
    isMemberExpression,
    SpreadElement
} from "babel-types";

function chainToMemberList(expr: CallExpression, acc: Link[] = []): Link[] {
    const callee = expr.callee;
    if (isMemberExpression(callee)) {
        if (!isIdentifier(callee.property)) throw Error("Expected property in " + callee.property);
        const newLink: Link = {methodName: callee.property.name, arguments: expr.arguments};
        if (isCallExpression(callee.object)) return chainToMemberList(callee.object, [newLink, ...acc]);
        return [newLink, ...acc];
    } else return acc;
}

function getLeftMost(expr: CallExpression): Expression {
    const callee = expr.callee;
    if (isMemberExpression(callee)) {
        if (isCallExpression(callee.object)) {
            return getLeftMost(callee.object);
        } else if (isIdentifier(callee.object)) {
            return callee.object;
        } else {
            return expr;
        }
    } else return expr;
}

export interface Link {
    methodName: string;
    arguments: Array<Expression | SpreadElement>;
}

export interface Chain {
    leftmost: Expression;
    links: Link[];
}

export function buildChain(expr: CallExpression): Chain {
    return {
        leftmost: getLeftMost(expr),
        links: chainToMemberList(expr),
    };
}
