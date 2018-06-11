import {promisify} from "util";
import * as path from "path";
import * as fs from "fs";

import * as babel from "babel-core";
import {CssGetPlugin} from "../../src/plugins/manipulation/style-properties/css.get.plugin";
import {renameQunitModulePlugin} from "./rename-qunit-module-plugin";
import {filterTestsPlugin} from "./filter-tests-plugin";
import {setTestFilesPlugin} from "./set-test-files-plugin";

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
            CssGetPlugin.babel,
        ],
        toFile: "css.get.plugin.transform.js",
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
