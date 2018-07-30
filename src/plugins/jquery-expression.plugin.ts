import {
    CallExpression,
    Expression,
    expressionStatement,
    Statement,
    VariableDeclarator,
    variableDeclarator,
} from "babel-types";
import {NodePath, Visitor} from "babel-traverse";
import {CallExpressionOfjQueryCollection} from "../model/matchers/call-expression-of-jquery-collection";
import {CallExpressionOfjQueryGlobal} from "../model/matchers/call-expression-of-jquery-global";
import {
    matchesCallExpressionOfjQueryCollection,
    matchesCallExpressionOfjQueryGlobal,
    matchesCallExpressionOfjQueryGlobalMember,
} from "./matchers";
import {buildChain, Chain} from "./chain";
import {Plugin} from "../model/plugin";
import {unchainExpressions} from "./unchain";
import {ReturnSelf} from "../model/return-types/return-self";
import {arrayCollector} from "../util/collectors";
import {ReturnValue} from "../model/return-types/return-value";

export interface CallExpressionOfjQueryCollectionPlugin extends Plugin {
    matchesExpressionType: CallExpressionOfjQueryCollection;
}

function replaceWithPluginOutput(path: NodePath<CallExpression>, newExpression: Expression | Statement[]) {
    if (Array.isArray(newExpression)) path.replaceWithMultiple(newExpression);
    else path.replaceWith(newExpression);
}

function transformVariableDeclarator(path: NodePath<CallExpression>, plugin: Plugin, chain: Chain, args: Expression[]) {
    const parent = path.parentPath as NodePath<VariableDeclarator>;
    if (plugin.escapeFromChain) {
        parent.replaceWith(variableDeclarator(parent.node.id, chain.leftmost));
        const replacement = plugin.replaceWith(chain.leftmost, args, path.scope);
        parent.getStatementParent().insertAfter(replacement);
    } else if (plugin.returnType instanceof ReturnSelf) {
        parent.replaceWith(variableDeclarator(parent.node.id, chain.leftmost));
        const id = path.scope.generateUidIdentifier("element");
        const collected = arrayCollector(parent.node.id as Expression,
            "forEach", id, (ele) => {
                return plugin.replaceWith(ele, args, path.scope) as Expression;
            });
        parent.getStatementParent().insertAfter(expressionStatement(collected));
    } else if (plugin.returnType instanceof ReturnValue) {
        const applied = plugin.replaceWith(chain.leftmost, args, path.scope);
        const wrap = variableDeclarator(parent.node.id, applied as Expression);
        parent.replaceWith(wrap);
    }
}

function extractExpression(path: NodePath<CallExpression>, plugin: CallExpressionOfjQueryCollectionPlugin,
                           chain: Chain, args: Expression[]) {
    if (plugin.escapeFromChain) {
        const out = plugin.replaceWith(chain.leftmost, args, path.scope);
        replaceWithPluginOutput(path, out);
    } else if (plugin.returnType instanceof ReturnSelf) {
        const id = path.scope.generateUidIdentifier("element");

        const collected = arrayCollector(chain.leftmost as Expression,
            "forEach", id, (ele) => {
                return plugin.replaceWith(ele, args, path.scope) as Expression;
            });
        path.replaceWith(collected);
    } else if (plugin.returnType instanceof ReturnValue) {
        const applied = plugin.replaceWith(chain.leftmost, args, path.scope);
        replaceWithPluginOutput(path, applied);
    }
}

export function jQueryExpressionPlugin(plugins: Plugin[]): { visitor: Visitor } {
    const collectionPlugins =
        plugins.filter(p => p.matchesExpressionType instanceof CallExpressionOfjQueryCollection) as
            CallExpressionOfjQueryCollectionPlugin[];
    const callExpressionOfjQueryGlobalPlugins =
        plugins.filter(p => p.matchesExpressionType instanceof CallExpressionOfjQueryGlobal);

    const CallExpressionTransform = (path: NodePath<CallExpression>) => {
        const node = path.node;
        const args = node.arguments as Expression[]; // TODO accept Spread
        if (matchesCallExpressionOfjQueryGlobalMember(node)) {
            const functionName = node.callee.property.name;
            console.log("Found CallExpressionOfjQueryMember", functionName);
        } else if (matchesCallExpressionOfjQueryGlobal(node)) {
            callExpressionOfjQueryGlobalPlugins
                .filter(plugin => plugin.applicableWithArguments(node.arguments))
                .forEach(plugin => {
                    replaceWithPluginOutput(path, plugin.replaceWith(node, args, path.scope));
                });
        } else if (matchesCallExpressionOfjQueryCollection(node)) {
            const chain = buildChain(node);
            if (chain.links.length > 1) {
                unchainExpressions(path, chain, plugins);
            } else {
                const [link] = chain.links;
                const matchedPlugins = collectionPlugins.filter(
                    p => p.matchesExpressionType.methodName === link.methodName &&
                        p.applicableWithArguments(link.arguments),
                );
                if (matchedPlugins.length === 0) return;
                const [plugin] = matchedPlugins;

                // TODO remove messy casts.
                if (path.parentPath.isVariableDeclarator()) {
                    transformVariableDeclarator(path, plugin, chain, args);
                } else {
                    extractExpression(path, plugin, chain, args);
                }
            }
        }
    };

    return {
        visitor: {
            CallExpression: CallExpressionTransform,
        },
    };
}
