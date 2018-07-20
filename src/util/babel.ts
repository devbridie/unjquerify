import {
    arrayExpression,
    ArrowFunctionExpression,
    CallExpression,
    callExpression,
    Expression,
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

export function mapNodeList(nodeList: Expression, mapFn: ArrowFunctionExpression): Expression {
    return map(arrayFrom(nodeList), mapFn);
}

export function map(array: Expression, mapFn: ArrowFunctionExpression): CallExpression {
    const mapMember = memberExpression(array, identifier("map"));
    return callExpression(mapMember, [mapFn]);
}

export function flatMap(array: Expression, mapFn: ArrowFunctionExpression): Expression {
    const mapCall = map(array, mapFn);
    const concat = memberExpression(arrayExpression(), identifier("concat"));
    return callExpression(concat, [spreadElement(mapCall)]);
}

export function arrayFrom(nodeList: Expression): Expression {
    return callExpression(memberExpression(identifier("Array"), identifier("from")), [nodeList]);
}
