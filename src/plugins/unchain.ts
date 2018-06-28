import {
    assertIdentifier,
    CallExpression,
    callExpression,
    Expression,
    expressionStatement,
    Identifier,
    identifier,
    isExpressionStatement, isIdentifier,
    isVariableDeclaration,
    isVariableDeclarator,
    memberExpression,
    Statement,
    VariableDeclaration,
    variableDeclaration,
    variableDeclarator,
} from "babel-types";
import {Chain, Link} from "./chain";
import {NodePath} from "babel-traverse";
import {plugins} from "../all-plugins";
import {CallExpressionOfjQueryCollection} from "../model/call-expression-of-jquery-collection";
import {CallExpressionOfjQueryCollectionPlugin} from "./jquery-expression.plugin";

function generateAssignment(expr: Expression, id: Identifier): Statement {
    return variableDeclaration("const", [variableDeclarator(id, expr)]);
}

function linkToCallExpression(object: Expression, link: Link): CallExpression {
    return callExpression(memberExpression(object, identifier(link.methodName)), link.arguments);
}

const collectionPlugins =
    plugins.filter(p => p.matchesExpressionType instanceof CallExpressionOfjQueryCollection) as
        CallExpressionOfjQueryCollectionPlugin[];

function generateStatements(path: NodePath<CallExpression>, chain: Chain, endWithIdentifier?: Identifier): Statement[] {
    const linkMutatations = [...chain.links.map(link => {
        const plugin = collectionPlugins.filter(p => p.matchesExpressionType.methodName === link.methodName);
        return plugin.some(p => p.causesChainMutation);
    })];
    if (linkMutatations.filter(m => m === true).length === 0) { // no mutations is special, return early
        const id = endWithIdentifier ? endWithIdentifier : path.scope.generateUidIdentifier("chain");
        return [
            generateAssignment(chain.leftmost, id),
            ...chain.links.map(link => expressionStatement(linkToCallExpression(id, link))),
        ];
    }

    let currentChainIdentifier = path.scope.generateUidIdentifier("start");
    const statements: Statement[] = [];
    for (let i = 0; i < chain.links.length; i++) {
        const hasMutation = linkMutatations[i];
        const link = chain.links[i];
        if (i === 0) {
            if (hasMutation) {
                const expr = linkToCallExpression(chain.leftmost, link);
                statements.push(generateAssignment(expr, currentChainIdentifier));
            } else {
                if (isIdentifier(chain.leftmost)) {
                    currentChainIdentifier = chain.leftmost;
                } else {
                    const expr = linkToCallExpression(chain.leftmost, link);
                    statements.push(generateAssignment(expr, currentChainIdentifier));
                }
            }
        } else {
            if (hasMutation) {
                const expr = linkToCallExpression(currentChainIdentifier, link);
                if (endWithIdentifier && i === linkMutatations.lastIndexOf(true)) {
                    currentChainIdentifier = endWithIdentifier;
                } else {
                    currentChainIdentifier = path.scope.generateUidIdentifier("chain");
                }
                statements.push(generateAssignment(expr, currentChainIdentifier));
            } else {
                statements.push(expressionStatement(linkToCallExpression(currentChainIdentifier, link)));
            }
        }
    }

    return statements;
}

export function unchainExpressions(path: NodePath<CallExpression>, chain: Chain) {
    if (isExpressionStatement(path.parent)) {
        const statements = generateStatements(path, chain);
        path.getStatementParent().replaceWithMultiple(statements);
    } else if (isVariableDeclarator(path.parent)) {
        const id = path.parent.id as Identifier;
        assertIdentifier(id);
        const statements = generateStatements(path, chain, id);
        const parentPath = path.parentPath;
        const assignments = statements.filter(s => isVariableDeclaration(s)) as VariableDeclaration[];
        const lastAssignment = assignments[assignments.length - 1];
        const lastAssignmentValue = lastAssignment.declarations[0].init;
        parentPath.get("init").replaceWith(lastAssignmentValue);
        const before = statements.splice(0, statements.lastIndexOf(lastAssignment));
        path.getStatementParent().insertBefore(before);
        const after = statements.splice(statements.lastIndexOf(lastAssignment) + 1, statements.length);
        path.getStatementParent().insertAfter(after);
    }
}
