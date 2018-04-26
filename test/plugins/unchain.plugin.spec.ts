import * as assert from "assert";
import * as babel from "babel-core";
import "mocha";
import unchainPlugin from "../../src/plugins/unchain.plugin";

describe("unchain plugin", () => {
    it("should transform 2 links", () => {
        const code = `const x = a().b()`;
        const plain = babel.transform(code);
        const transformation = babel.transform(code, {plugins: [unchainPlugin]});
        console.log(transformation.code);
        assert.notStrictEqual(plain.code, transformation.code);
    });
    it("should transform 3 links", () => {
        const code = `const x = a().b().c()`;
        const plain = babel.transform(code);
        const transformation = babel.transform(code, {plugins: [unchainPlugin]});
        console.log(transformation.code);
        assert.notStrictEqual(plain.code, transformation.code);
    });
});
