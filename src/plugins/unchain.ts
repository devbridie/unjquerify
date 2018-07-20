import {
    CallExpression,
    callExpression,
    Expression,
    expressionStatement,
    Identifier,
    identifier,
    isExpressionStatement,
    isIdentifier,
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
import {CallExpressionOfjQueryCollection} from "../model/matchers/call-expression-of-jquery-collection";
import {CallExpressionOfjQueryCollectionPlugin} from "./jquery-expression.plugin";
import {Plugin} from "../model/plugin";
import {ReturnSelf} from "../model/return-types/return-self";
import {ReturnValue} from "../model/return-types/return-value";

function generateAssignment(expr: Expression, id: Identifier): Statement {
    return variableDeclaration("const", [variableDeclarator(id, expr)]);
}

export function linkToCallExpression(object: Expression, link: Link): CallExpression {
    return callExpression(memberExpression(object, identifier(link.methodName)), link.arguments);
}

function generateStatements(path: NodePath<CallExpression>,
                            {leftmost, links}: Chain, plugins: Plugin[]): Statement[] {

    const collectionPlugins =
        plugins.filter(p => p.matchesExpressionType instanceof CallExpressionOfjQueryCollection) as
            CallExpressionOfjQueryCollectionPlugin[];

    function lookupPlugin(link: Link): Plugin[] {
        return collectionPlugins.filter(p =>
            p.matchesExpressionType.methodName === link.methodName && p.applicableWithArguments(link.arguments),
        );
    }

    const statements = [];

    let lastChainVariable: Identifier;
    if (!isIdentifier(leftmost)) {
        lastChainVariable = path.scope.generateUidIdentifier("start");
        statements.push(generateAssignment(leftmost, lastChainVariable));
    } else {
        lastChainVariable = leftmost;
    }

    for (const link of links) {
        const plugin = lookupPlugin(link)[0];
        if (!plugin || plugin.returnType instanceof ReturnSelf) {
            statements.push(expressionStatement(linkToCallExpression(lastChainVariable, link)));
        } else if (plugin.returnType instanceof ReturnValue) {
            const newChain = path.scope.generateUidIdentifier("chain");
            statements.push(generateAssignment(linkToCallExpression(lastChainVariable, link), newChain));
            lastChainVariable = newChain;
        }
    }
    return statements;
}

export function unchainExpressions(path: NodePath<CallExpression>, chain: Chain, plugins: Plugin[]) {
    if (isExpressionStatement(path.parent)) {
        const statements = generateStatements(path, chain, plugins);
        path.getStatementParent().replaceWithMultiple(statements);
    } else if (isVariableDeclarator(path.parent)) {
        const statements = generateStatements(path, chain, plugins);
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
