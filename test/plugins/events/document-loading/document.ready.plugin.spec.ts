import * as assert from "assert";
import * as babel from "babel-core";
import "mocha";
import {DocumentReadyPlugin} from "../../../../src/plugins/events/document-loading/document.ready.plugin";

describe("$(document).ready", () => {
    it("should transform $(document).ready(function() {})", () => {
        const code = "$(document).ready(function() {})";
        const plain = babel.transform(code);
        const transformation = babel.transform(code, {plugins: [DocumentReadyPlugin]});
        assert.notStrictEqual(plain.code, transformation.code);
    });

    it("should not transform $(document).otherFunction(function() {})", () => {
        const code = "$(document).otherFunction(function() {})";
        const plain = babel.transform(code);
        const transformation = babel.transform(code, {plugins: [DocumentReadyPlugin]});
        assert.strictEqual(plain.code, transformation.code);
    });
});
