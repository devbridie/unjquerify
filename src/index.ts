import * as babel from "babel-core";
import * as fs from "fs";
import * as path from "path";
import {promisify} from "util";
import documentReadyPlugin from "./plugins/document.ready.plugin";
import getElementByIdPlugin from "./plugins/selector.getElementById.plugin";

const file = "../sample/simple.js";

(async () => {
    const fileContents = await promisify(fs.readFile)(path.resolve(__dirname, file), "utf8");

    console.log("Input:");
    console.log(fileContents);
    console.log("----");

    const transformed = babel.transform(fileContents, {
        plugins: [
            documentReadyPlugin,
            getElementByIdPlugin,
        ],
    });

    console.log("----");
    console.log("Output:");
    console.log(transformed.code);

})();
