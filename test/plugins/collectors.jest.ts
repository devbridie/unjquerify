import * as babel from "babel-core";
import {jQueryExpressionPlugin} from "../../src/plugins/jquery-expression.plugin";
import {HidePlugin} from "../../src/plugins/effects/basics/hide.plugin";
import {CssGetPlugin} from "../../src/plugins/manipulation/style-properties/css.get.plugin";

describe("collectors", () => {
    it("chain > value", () => {
        const example = `const size = $("div").hide().css("font-size");`;
        const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin([HidePlugin, CssGetPlugin])]}).code;
        expect(transformed).toMatchSnapshot();
    });

    it("chain", () => {
        const example = `const divs = $("div").hide();`;
        const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin([HidePlugin])]}).code;
        expect(transformed).toMatchSnapshot();
    });

    it("value", () => {
        const example = `const fontSize = $("div").css("font-size");`;
        const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin([CssGetPlugin])]}).code;
        expect(transformed).toMatchSnapshot();
    });
});