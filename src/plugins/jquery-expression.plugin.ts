import {CallExpression} from "babel-types";
import {NodePath} from "babel-traverse";
import {plugins} from "../all-plugins";
import {CallExpressionOfjQueryCollection} from "../model/call-expression-of-jquery-collection";
import {CallExpressionOfjQueryGlobal} from "../model/call-expression-of-jquery-global";
import {
    matchesCallExpressionOfjQueryCollection,
    matchesCallExpressionOfjQueryGlobal,
    matchesCallExpressionOfjQueryGlobalMember,
} from "./matchers";
import {buildChain} from "./chain";
import {Plugin} from "../model/plugin";
import {unchainExpressions} from "./unchain";

const callExpressionOfjQueryGlobalPlugins =
    plugins.filter(p => p.matchesExpressionType instanceof CallExpressionOfjQueryGlobal);

export interface CallExpressionOfjQueryCollectionPlugin extends Plugin {
    matchesExpressionType: CallExpressionOfjQueryCollection;
}

const collectionPlugins =
    plugins.filter(p => p.matchesExpressionType instanceof CallExpressionOfjQueryCollection) as
        CallExpressionOfjQueryCollectionPlugin[];

export const jQueryExpressionPlugin = () => ({
    visitor: {
        CallExpression: (path: NodePath<CallExpression>) => {
            const node = path.node;
            if (matchesCallExpressionOfjQueryGlobalMember(node)) {
                const functionName = node.callee.property.name;
                console.log("Found CallExpressionOfjQueryMember", functionName);
            } else if (matchesCallExpressionOfjQueryGlobal(node)) {
                callExpressionOfjQueryGlobalPlugins.map(p => {
                    const visitor = p.babel().visitor;
                    path.parentPath.traverse(visitor);
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
                    ps.map(p => path.parentPath.traverse(p.babel().visitor));
                }
            }
        },
    },
});
