import * as babel from "babel-core";
import * as fs from "fs";
import * as path from "path";
import {promisify} from "util";
import documentReadyPlugin from "./plugins/document.ready.plugin";
import getElementByIdPlugin from "./plugins/selector.getElementById.plugin";
import getElementsByClassNamePlugin from "./plugins/selector.getElementsByClassName.plugin";
import querySelectorAllPlugin from "./plugins/selector.querySelectorAll.plugin";

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
            getElementsByClassNamePlugin,
            querySelectorAllPlugin,
        ],
    });

    console.log("----");
    console.log("Output:");
    console.log(transformed.code);

})();
