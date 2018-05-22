import * as babel from "babel-core";
import * as fs from "fs";
import * as path from "path";
import {promisify} from "util";
import {plugins} from "./all-plugins";

const file = "../sample/simple.js";

(async () => {
    const fullFilePath = path.resolve(__dirname, file);
    const fileName = path.basename(fullFilePath);
    const fileContents = await promisify(fs.readFile)(fullFilePath, "utf8");

    console.log("Input:");
    console.log(fileContents);
    console.log("----");

    const transformed = babel.transform(fileContents, {
        plugins,
        sourceMaps: true,
        sourceFileName: fileName,
        ast: false,
    });

    console.log("----");
    console.log("Output:");
    console.log(transformed.code);

    console.log("Map:");
    console.log(transformed.map);
})();
