import {Reference} from "../model/reference";

export function youDontNeedJquery(section: string): Reference {
    return { type: "youdon'tneedjquery", url: "https://github.com/nefe/You-Dont-Need-jQuery#" + section };
}

export function mdnReference(subPath: string): Reference {
    return { type: "mdn", url: "https://developer.mozilla.org/en-US/docs/Web/API/" + subPath + "/" };
}

export function jqueryApiReference(subPath: string): Reference {
    return { type: "jquery", url: "https://api.jquery.com/" + subPath + "/" };
}
