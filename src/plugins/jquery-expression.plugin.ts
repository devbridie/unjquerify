import {
    CallExpression,
    Expression,
    identifier,
    variableDeclaration,
    VariableDeclarator,
    variableDeclarator
} from "babel-types";
import {NodePath, Visitor} from "babel-traverse";
import {CallExpressionOfjQueryCollection} from "../model/matchers/call-expression-of-jquery-collection";
import {CallExpressionOfjQueryGlobal} from "../model/matchers/call-expression-of-jquery-global";
import {
    matchesCallExpressionOfjQueryCollection,
    matchesCallExpressionOfjQueryGlobal,
    matchesCallExpressionOfjQueryGlobalMember,
} from "./matchers";
import {buildChain} from "./chain";
import {Plugin} from "../model/plugin";
import {unchainExpressions} from "./unchain";

export interface CallExpressionOfjQueryCollectionPlugin extends Plugin {
    matchesExpressionType: CallExpressionOfjQueryCollection;
}

export const jQueryExpressionPlugin: (plugins: Plugin[]) => { visitor: Visitor } = (plugins: Plugin[]) => {
    const collectionPlugins =
        plugins.filter(p => p.matchesExpressionType instanceof CallExpressionOfjQueryCollection) as
            CallExpressionOfjQueryCollectionPlugin[];
    const callExpressionOfjQueryGlobalPlugins =
        plugins.filter(p => p.matchesExpressionType instanceof CallExpressionOfjQueryGlobal);
    return {
        visitor: {
            CallExpression: (path: NodePath<CallExpression>) => {
                const node = path.node;
                if (matchesCallExpressionOfjQueryGlobalMember(node)) {
                    const functionName = node.callee.property.name;
                    console.log("Found CallExpressionOfjQueryMember", functionName);
                } else if (matchesCallExpressionOfjQueryGlobal(node)) {
                    callExpressionOfjQueryGlobalPlugins
                        .filter(p => p.applicableWithArguments(node.arguments))
                        .forEach(p => {
                            const out = p.replaceWith(node, node.arguments as Expression[], path.scope);
                            if (Array.isArray(out)) path.replaceWithMultiple(out);
                            else path.replaceWith(out);
                        });
                } else if (matchesCallExpressionOfjQueryCollection(node)) {
                    const chain = buildChain(node);
                    if (chain.links.length > 1) {
                        unchainExpressions(path, chain);
                    } else {
                        const link = chain.links[0];
                        const ps = collectionPlugins.filter(
                            p => p.matchesExpressionType.methodName === link.methodName,
                        );
                        if (ps.length === 0) return;
                        const plugin = ps[0];

                        if (path.parentPath.isVariableDeclarator()) {
                            const parent = path.parentPath as NodePath<VariableDeclarator>;
                            const id = identifier("chain");
                            parent.getStatementParent().insertBefore(variableDeclaration("const", [
                                variableDeclarator(id, chain.leftmost),
                            ]));
                            const transformed = plugin.replaceWith(id, node.arguments as Expression[], path.scope);
                            const wrap = variableDeclarator(parent.node.id, transformed as Expression);
                            parent.replaceWith(wrap);
                        } else {
                            const out = plugin.replaceWith(chain.leftmost, node.arguments as Expression[], path.scope);
                            if (Array.isArray(out)) path.replaceWithMultiple(out);
                            else path.replaceWith(out);
                        }
                    }
                }
            },
        },
    };
};
