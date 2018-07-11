import * as babel from "babel-core";
import {jQueryExpressionPlugin} from "../../src/plugins/jquery-expression.plugin";
import {HidePlugin} from "../../src/plugins/effects/basics/hide.plugin";
import {CssGetPlugin} from "../../src/plugins/manipulation/style-properties/css.get.plugin";
import {QuerySelectorAllPlugin} from "../../src/plugins/selectors/querySelectorAll.plugin";

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
});
