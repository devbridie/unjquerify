import {Expression, identifier, MemberExpression, memberExpression} from "babel-types";

export function nestedMemberExpressions(object: Expression, properties: string[]): MemberExpression {
    const reducer = (prev, current) => memberExpression(prev, identifier(current));
    return properties.reduce(reducer, object) as MemberExpression;
}