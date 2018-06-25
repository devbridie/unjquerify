import * as babel from "babel-core";
import * as fs from "fs";
import {promisify} from "util";
// import {plugins} from "./all-plugins";
import {jQueryExpressionPlugin} from "./plugins/jquery-expression.plugin";

const cli = require("command-line-parser");

(async () => {
    const args: any = cli();
    const file = (args._args && args._args[0]) || undefined;
    const withInlineSourceMap = args.withInlineSourceMap;
    if (!file) {
        console.error("Please specify a file to convert as the first argument to this script.");
        process.exit(1);
        return;
    }
    const fileContents = await promisify(fs.readFile)(file, "utf8");
    const transformed = babel.transform(fileContents, {
        plugins: [jQueryExpressionPlugin],
        sourceMaps: withInlineSourceMap ? "inline" : false,
        sourceFileName: file,
        ast: false,
    });
    console.log(transformed.code);
})();
