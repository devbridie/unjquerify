import * as babel from "babel-core";
import {jQueryExpressionPlugin} from "./plugins/jquery-expression.plugin";
import {plugins} from "./all-plugins";

const cli = require("command-line-parser");

const args: any = cli();
const file = (args._args && args._args[0]) || undefined;
const withInlineSourceMap = args.withInlineSourceMap;
if (file) {
    const transformed = babel.transformFileSync(file, {
        plugins: [jQueryExpressionPlugin(plugins)],
        sourceMaps: withInlineSourceMap ? "inline" : false,
        sourceFileName: file,
        ast: false,
    });
    console.log(transformed.code);
} else {
    console.error("Please specify a file to convert as the first argument to this script.");
    process.exit(1);
}
