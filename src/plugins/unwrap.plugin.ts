import * as babel from "babel-core";
import {isIdentifier, MemberExpression} from "babel-types";
import {isJQueryWrappedElement, unWrapjQueryElement} from "../util/jquery-heuristics";
import {NodePath} from "babel-traverse";

export const UnwrapPlugin = () => ({
    visitor: {
        /*
            $(htmlElement)[0] => htmlElement
         */
        MemberExpression: {
            exit: (path: NodePath<MemberExpression>) => {
                const node = path.node;
                if (!isIdentifier(node.property)) return;
                if (node.property.name !== "0") return;
                if (!isJQueryWrappedElement(node.object)) return;
                const arg = unWrapjQueryElement(node.object);
                path.replaceWith(arg);
            },
        },
    } as babel.Visitor<{}>,
});
