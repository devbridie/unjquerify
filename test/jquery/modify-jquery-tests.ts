import {promisify} from "util";
import * as path from "path";
import * as fs from "fs";

import * as babel from "babel-core";
import {CssGetPlugin} from "../../src/plugins/manipulation/style-properties/css.get.plugin";
import {renameQunitModulePlugin} from "./rename-qunit-module-plugin";
import {filterTestsPlugin} from "./filter-tests-plugin";
import {setTestFilesPlugin} from "./set-test-files-plugin";
import {IsPlugin} from "../../src/plugins/traversing/filtering/is.plugin";
import {removeAssertPlugin} from "./remove-assert-plugin";
import {removeExpectTotalPlugin} from "./remove-expect-total-plugin";
import {CssSetPlugin} from "../../src/plugins/manipulation/style-properties/css.set.plugin";
import {jQueryExpressionPlugin} from "../../src/plugins/jquery-expression.plugin";
import {QuerySelectorAllPlugin} from "../../src/plugins/selectors/querySelectorAll.plugin";

interface TestConversion {
    fromFile: string;
    plugins: any[];
    toFile: string;
}

const testConversions: TestConversion[] = [
    {
        fromFile: "css.js",
        plugins: [
            renameQunitModulePlugin("CssGetPlugin"),
            filterTestsPlugin(["css(String|Hash)", "show/hide detached nodes"]),
            jQueryExpressionPlugin([CssGetPlugin, QuerySelectorAllPlugin]),
        ],
        toFile: "css.get.plugin.transform.js",
    },
    {
        fromFile: "css.js",
        plugins: [
            renameQunitModulePlugin("CssSetPlugin"),
            filterTestsPlugin(["css(String|Hash)", "show/hide detached nodes"]),
            jQueryExpressionPlugin([CssSetPlugin, QuerySelectorAllPlugin]),
        ],
        toFile: "css.set.plugin.transform.js",
    },
    {
        fromFile: "traversing.js",
        plugins: [
            renameQunitModulePlugin("IsPlugin"),
            filterTestsPlugin(["is(String|undefined)"], true),
            removeAssertPlugin([/.*invalid (expression|object).*/]),
            removeExpectTotalPlugin("is(String|undefined)", 23 - 5),
            jQueryExpressionPlugin([IsPlugin, QuerySelectorAllPlugin]),
        ],
        toFile: "traversing.transform.js",
    },
];

(async () => {
    const dir = "repo/test/unit-unjquerify";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    testConversions.map(async (conversion: TestConversion) => {
        const fromFile = path.resolve(__dirname, "repo/test/unit", conversion.fromFile);
        const fileContents = await promisify(fs.readFile)(fromFile, "utf8");
        const transformed = babel.transform(fileContents, {
            plugins: conversion.plugins,
        });
        const out = transformed.code;
        const toFile = path.resolve(__dirname, "repo/test/unit-unjquerify", conversion.toFile);
        await promisify(fs.writeFile)(toFile, out);
    });
    {
        const testInitFile = "repo/test/data/testinit.js";
        const contents = await promisify(fs.readFile)(testInitFile, "utf8");
        const transformed = babel.transform(contents, {
            plugins: [setTestFilesPlugin(testConversions.map(c => c.toFile).map(f => "unit-unjquerify/" + f))],
        });
        const out = transformed.code;
        const toFile = path.resolve(__dirname, testInitFile);
        await promisify(fs.writeFile)(toFile, out);
    }
})();
