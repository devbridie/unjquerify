import {
    assertExpression,
    Expression,
    isExpressionStatement,
    isVariableDeclarator,
    variableDeclaration,
    VariableDeclarator,
    variableDeclarator
} from "babel-types";
import {NodePath} from "babel-traverse";

export type ChainFunction = (expr: Expression) => Expression;

export function continueChainOnVoid(path: NodePath<Expression>, oldLink: Expression,
                                    newLinker: ChainFunction): void {
    if (isExpressionStatement(path.parent)) { // there is not need to chain an expression if the reference is discarded
        path.replaceWith(newLinker(oldLink));
    } else if (isVariableDeclarator(path.parent)) { // mutate this declarator directly instead of const a = b;
        const declaratorPath = path.parentPath as NodePath<VariableDeclarator>;
        declaratorPath.get("init").replaceWith(oldLink);
        const ret = declaratorPath.node.id as Expression;
        assertExpression(ret);
        path.replaceWith(oldLink);
        path.getStatementParent().insertAfter(newLinker(ret));
    } else { // safe option: generate new binding, assign, then replace with new ref.
        const chain = path.scope.generateUidIdentifier("chain");
        path.getStatementParent().insertBefore(variableDeclaration("const", [
            variableDeclarator(chain, oldLink),
        ]));
        path.getStatementParent().insertBefore(newLinker(chain));
        path.replaceWith(chain);
    }
}
