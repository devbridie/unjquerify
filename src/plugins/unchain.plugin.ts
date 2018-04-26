import * as babel from "babel-core";

import {
    assignmentExpression,
    callExpression,
    CallExpression,
    Expression,
    expressionStatement,
    Identifier,
    isCallExpression,
    isIdentifier,
    isMemberExpression,
    memberExpression,
    MemberExpression,
    SpreadElement,
    variableDeclaration,
    variableDeclarator
} from "babel-types";

import {some} from "fp-ts/lib/Option";

const template = require("@babel/template");

const replaceAstTemplate = template.expression(`$(document.querySelectorAll(SELECTOR))`,
    {placeholderPattern: /^[_A-Z0-9]+$/},
);

interface ChainedMemberExpression extends MemberExpression {
    object: CallExpression;
    property: Identifier;
}

interface ChainedCallExpression extends CallExpression {
    callee: ChainedMemberExpression;
}

// TODO this should be fixed for jQuery expressions only
function isChainedCall(expr: CallExpression): expr is ChainedCallExpression {
    return isMemberExpression(expr.callee) &&
        isCallExpression(expr.callee.object) &&
        isIdentifier(expr.callee.property);
}

type ChainedTuple = [Identifier, Array<Expression | SpreadElement>];

function buildChain(expr: CallExpression, acc: ChainedTuple[] = []): ChainedTuple[] {
    if (isChainedCall(expr)) {
        const item: ChainedTuple = [expr.callee.property, expr.arguments];
        const newAcc = [item, ...acc];
        return buildChain(expr.callee.object, newAcc);
    } else {
        if (isIdentifier(expr.callee)) {
            const item: ChainedTuple = [expr.callee, expr.arguments];
            return [item, ...acc];
        }
        throw Error("");
    }
}

export default () => ({
    visitor: {
        /*
            $("...").a().b() -> let x = $("..."); x = x.a(); x = x.b();
         */
        CallExpression: (path) => {
            some(path.node).map(node => {
                if (isChainedCall(node)) {
                    const chain = buildChain(node);
                    const chainVariable = path.scope.generateUidIdentifier("chain");
                    const first = chain[0];
                    const middle = chain.slice(1, chain.length - 1);
                    const last = chain[chain.length - 1];

                    // TODO this only works for the example
                    const firstExpression = callExpression(first[0], first[1]);
                    const statements = [
                        variableDeclaration("let", [variableDeclarator(chainVariable, firstExpression)]),
                        ...middle.map(link => {
                            const linkExpression = callExpression(memberExpression(chainVariable, link[0]), link[1]);
                            return expressionStatement(assignmentExpression("=", chainVariable, linkExpression));
                        }),
                    ];
                    path.getStatementParent().insertBefore(statements);
                    path.replaceWith(callExpression(memberExpression(chainVariable, last[0]), last[1]));
                }
            });
        },
    } as babel.Visitor<{}>,
});
