import {CssGetPlugin} from "./plugins/manipulation/style-properties/css.get.plugin";
import {OnPlugin} from "./plugins/events/event-handler-attachment/on.plugin";
import {ClickHandlerPlugin} from "./plugins/events/mouse-events/click.handler.plugin";
import {GetElementsByClassNamePlugin} from "./plugins/selectors/getElementsByClassName.plugin";
import {TextSetPlugin} from "./plugins/manipulation/dom-insertion/text.set.plugin";
import {AddClassPlugin} from "./plugins/attributes/addclass.plugin";
import {UnwrapPlugin} from "./plugins/unwrap.plugin";
import {GetElementByIdPlugin} from "./plugins/selectors/getElementById.plugin";
import {HidePlugin} from "./plugins/effects/basics/hide.plugin";
import {QuerySelectorAllPlugin} from "./plugins/selectors/querySelectorAll.plugin";
import {TextGetPlugin} from "./plugins/manipulation/dom-insertion/text.get.plugin";
import {DocumentReadyPlugin} from "./plugins/events/document-loading/document.ready.plugin";

export const plugins = [
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
];