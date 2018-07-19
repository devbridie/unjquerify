import "jest";
import * as babel from "babel-core";
import {jQueryExpressionPlugin} from "../../src/plugins/jquery-expression.plugin";
import {AddClassPlugin} from "../../src/plugins/attributes/addclass.plugin";
import {QuerySelectorAllPlugin} from "../../src/plugins/selectors/querySelectorAll.plugin";
import {FindPlugin} from "../../src/plugins/traversing/tree-traversal/find.plugin";
import {CssGetPlugin} from "../../src/plugins/manipulation/style-properties/css.get.plugin";
import {HidePlugin} from "../../src/plugins/effects/basics/hide.plugin";
import {CssSetPlugin} from "../../src/plugins/manipulation/style-properties/css.set.plugin";

describe("unchain", () => {
    describe("as statement", () => {
        test("transforms mutationless expression correctly", () => {
            const example = `$("a").addClass("clazz").hide().css("font-size",12);`;
            const plugins = [AddClassPlugin, QuerySelectorAllPlugin, HidePlugin, CssSetPlugin];
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin(plugins)]}).code;
            expect(transformed).toMatchSnapshot();
        });

        test("transforms mutated expression correctly", () => {
            const example = `$("div").addClass("clazz").find("a").css("font-size",12);`;
            const plugins = [AddClassPlugin, QuerySelectorAllPlugin, FindPlugin, CssSetPlugin];
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin(plugins)]}).code;
            expect(transformed).toMatchSnapshot();
        });
    });

    describe("as assignment rval", () => {
        test("transforms mutationless expression correctly value", () => {
            const example = `const as = $("a").addClass("clazz").hide().css("font-size",12);`;
            const plugins = [AddClassPlugin, QuerySelectorAllPlugin, CssSetPlugin, HidePlugin];
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin(plugins)]}).code;
            expect(transformed).toMatchSnapshot();
        });

        test("transforms mutationless expression correctly", () => {
            const example = `const fontSize = $("a").addClass("clazz").hide().css("font-size");`;
            const plugins = [AddClassPlugin, QuerySelectorAllPlugin, CssGetPlugin, HidePlugin];
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin(plugins)]}).code;
            expect(transformed).toMatchSnapshot();
        });

        test("transforms mutated expression correctly", () => {
            const example = `const fontSize = $("div").addClass("clazz").css("font-size");`;
            const plugins = [AddClassPlugin, QuerySelectorAllPlugin, CssGetPlugin];
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin(plugins)]}).code;
            expect(transformed).toMatchSnapshot();
        });

        test("transforms child mutated expression correctly as value", () => {
            const example = `const fontSize = $("div").addClass("clazz").find("a").css("font-size");`;
            const plugins = [AddClassPlugin, QuerySelectorAllPlugin, FindPlugin, CssGetPlugin];
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin(plugins)]}).code;
            expect(transformed).toMatchSnapshot();
        });
    });

    describe("short chain", () => {
        test("transforms self", () => {
            const example = `const as = $("a").addClass("clazz");`;
            const plugins = [AddClassPlugin, QuerySelectorAllPlugin];
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin(plugins)]}).code;
            expect(transformed).toMatchSnapshot();
        });
    });
});
