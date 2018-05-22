import * as babel from "babel-core";
import * as fs from "fs";
import * as path from "path";
import {promisify} from "util";
import {DocumentReadyPlugin} from "./plugins/events/document-loading/document.ready.plugin";
import {CssGetPlugin} from "./plugins/manipulation/style-properties/css.get.plugin";
import {GetElementByIdPlugin} from "./plugins/selectors/getElementById.plugin";
import {GetElementsByClassNamePlugin} from "./plugins/selectors/getElementsByClassName.plugin";
import {QuerySelectorAllPlugin} from "./plugins/selectors/querySelectorAll.plugin";
import {ClickHandlerPlugin} from "./plugins/events/mouse-events/click.handler.plugin";
import {OnPlugin} from "./plugins/events/event-handler-attachment/on.plugin";
import {AddClassPlugin} from "./plugins/attributes/addclass.plugin";
import {TextSetPlugin} from "./plugins/manipulation/dom-insertion/text.set.plugin";
import {TextGetPlugin} from "./plugins/manipulation/dom-insertion/text.get.plugin";
import {HidePlugin} from "./plugins/effects/basics/hide.plugin";
import {UnwrapPlugin} from "./plugins/unwrap.plugin";

const file = "../sample/simple.js";

(async () => {
    const fileContents = await promisify(fs.readFile)(path.resolve(__dirname, file), "utf8");

    console.log("Input:");
    console.log(fileContents);
    console.log("----");

    const transformed = babel.transform(fileContents, {
        plugins: [
            DocumentReadyPlugin,
            GetElementByIdPlugin,
            GetElementsByClassNamePlugin,
            QuerySelectorAllPlugin,
            CssGetPlugin,
            OnPlugin(),
            ClickHandlerPlugin,
            AddClassPlugin,
            TextSetPlugin,
            TextGetPlugin,
            HidePlugin,
            UnwrapPlugin,
        ],
    });

    console.log("----");
    console.log("Output:");
    console.log(transformed.code);

})();
