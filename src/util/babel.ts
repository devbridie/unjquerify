import {
    arrayExpression,
    ArrowFunctionExpression,
    callExpression,
    Expression,
    Identifier,
    identifier,
    MemberExpression,
    memberExpression,
    spreadElement
} from "babel-types";

export function nestedMemberExpressions(object: Expression, properties: string[]): MemberExpression {
    const reducer = (prev: Expression, current: string) => memberExpression(prev, identifier(current));
    return properties.reduce(reducer, object) as MemberExpression;
}

export function flatMapNodeList(nodeList: Expression, mapFn: ArrowFunctionExpression): Expression {
    return flatMap(arrayFrom(nodeList), mapFn);
}

export function flatMap(array: Expression, mapFn: ArrowFunctionExpression): Expression {
    const mapMember = memberExpression(array, identifier("map"));
    const mapCall = callExpression(mapMember, [mapFn]);
    const concat = memberExpression(arrayExpression(), identifier("concat"));
    return callExpression(concat, [spreadElement(mapCall)]);
}

export function arrayFrom(nodeList: Expression): Expression {
    return callExpression(memberExpression(identifier("Array"), identifier("from")), [nodeList]);
}
