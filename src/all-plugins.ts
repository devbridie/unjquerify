import {CssGetPlugin} from "./plugins/manipulation/style-properties/css.get.plugin";
import {GetElementsByClassNamePlugin} from "./plugins/selectors/getElementsByClassName.plugin";
import {TextSetPlugin} from "./plugins/manipulation/dom-insertion/text.set.plugin";
import {AddClassPlugin} from "./plugins/attributes/addclass.plugin";
import {HidePlugin} from "./plugins/effects/basics/hide.plugin";
import {QuerySelectorAllPlugin} from "./plugins/selectors/querySelectorAll.plugin";
import {TextGetPlugin} from "./plugins/manipulation/dom-insertion/text.get.plugin";
import {ReadyPlugin} from "./plugins/events/document-loading/ready.plugin";
import {Plugin} from "./model/plugin";
import {IsPlugin} from "./plugins/traversing/filtering/is.plugin";
import {AttrGetPlugin} from "./plugins/manipulation/general-attributes/attr.get.plugin";
import {AttrSetPlugin} from "./plugins/manipulation/general-attributes/attr.set.plugin";
import {HtmlGetPlugin} from "./plugins/manipulation/dom-insertion/html.get.plugin";
import {HtmlSetPlugin} from "./plugins/manipulation/dom-insertion/html.set.plugin";
import {RemovePlugin} from "./plugins/manipulation/dom-removal/remove.plugin";
import {EmptyPlugin} from "./plugins/manipulation/dom-removal/empty.plugin";
import {FindPlugin} from "./plugins/traversing/tree-traversal/find.plugin";
import {CssSetPlugin} from "./plugins/manipulation/style-properties/css.set.plugin";
import {ClickAttachPlugin} from "./plugins/events/mouse-events/click.attach.plugin";
import {OnPlugin} from "./plugins/events/event-handler-attachment/on.plugin";
import {SiblingsPlugin} from "./plugins/traversing/tree-traversal/siblings.plugin";
import {PrevPlugin} from "./plugins/traversing/tree-traversal/prev.plugin";
import {NextPlugin} from "./plugins/traversing/tree-traversal/next.plugin";
import {ValGetPlugin} from "./plugins/attributes/val.get.plugin";
import {ValSetPlugin} from "./plugins/attributes/val.set.plugin";
import {IndexPlugin} from "./plugins/miscellaneous/dom-element-methods/index.plugin";
import {ContentsPlugin} from "./plugins/traversing/miscellaneous-traversing/contents.plugin";

export const plugins: Plugin[] = [
    ReadyPlugin,
    GetElementsByClassNamePlugin,
    QuerySelectorAllPlugin,
    CssGetPlugin,
    CssSetPlugin,
    AddClassPlugin,
    TextSetPlugin,
    TextGetPlugin,
    HidePlugin,
    IsPlugin,
    AttrGetPlugin,
    AttrSetPlugin,
    HtmlGetPlugin,
    HtmlSetPlugin,
    RemovePlugin,
    EmptyPlugin,
    FindPlugin,
    ClickAttachPlugin,
    OnPlugin,
    SiblingsPlugin,
    PrevPlugin,
    NextPlugin,
    ValGetPlugin,
    ValSetPlugin,
    IndexPlugin,
    ContentsPlugin,
];
