export interface Reference {
    type: ReferenceType;
    url: string;
}

export type ReferenceType = "jquery" | "mdn" | "caniuse" | "youdon'tneedjquery";
