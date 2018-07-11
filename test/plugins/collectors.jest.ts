import * as babel from "babel-core";
import {jQueryExpressionPlugin} from "../../src/plugins/jquery-expression.plugin";
import {HidePlugin} from "../../src/plugins/effects/basics/hide.plugin";
import {CssGetPlugin} from "../../src/plugins/manipulation/style-properties/css.get.plugin";
import {QuerySelectorAllPlugin} from "../../src/plugins/selectors/querySelectorAll.plugin";
import {IsPlugin} from "../../src/plugins/traversing/filtering/is.plugin";
import {FindPlugin} from "../../src/plugins/traversing/tree-traversal/find.plugin";

describe("collectors", () => {
    it("chain > value", () => {
        const example = `const size = $("div").hide().css("font-size");`;
        const plugin = jQueryExpressionPlugin([HidePlugin, CssGetPlugin, QuerySelectorAllPlugin]);
        const transformed = babel.transform(example, {plugins: [plugin]}).code;
        expect(transformed).toMatchSnapshot();
    });

    it("chain", () => {
        const example = `const divs = $("div").hide();`;
        const plugin = jQueryExpressionPlugin([HidePlugin, QuerySelectorAllPlugin]);
        const transformed = babel.transform(example, {plugins: [plugin]}).code;
        expect(transformed).toMatchSnapshot();
    });

    it("value", () => {
        const example = `const fontSize = $("div").css("font-size");`;
        const plugin = jQueryExpressionPlugin([CssGetPlugin, QuerySelectorAllPlugin]);
        const transformed = babel.transform(example, {plugins: [plugin]}).code;
        expect(transformed).toMatchSnapshot();
    });

    it("example: is", () => {
        const example = `const matching = $("div").is(".article");`;
        const plugin = jQueryExpressionPlugin([IsPlugin, QuerySelectorAllPlugin]);
        const transformed = babel.transform(example, {plugins: [plugin]}).code;
        expect(transformed).toMatchSnapshot();
    });

    it("example: find", () => {
        const example = `const children = $("div").find(".article");`;
        const plugin = jQueryExpressionPlugin([FindPlugin, QuerySelectorAllPlugin]);
        const transformed = babel.transform(example, {plugins: [plugin]}).code;
        expect(transformed).toMatchSnapshot();
    });
});
