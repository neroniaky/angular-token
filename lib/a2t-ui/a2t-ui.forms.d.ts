export declare class BaseField {
    value: string;
    key: string;
    label: string;
    type: string;
    validators: any[];
    constructor(options?: {
        value?: string;
        key?: string;
        label?: string;
        type?: string;
        validators?: any[];
    });
}
export declare const SIGN_IN_FORM: BaseField[];
export declare const SIGN_UP_FORM: BaseField[];
export declare const RESET_PASSWORD_FORM: BaseField[];
export declare const UPDATE_PASSWORD_FORM: BaseField[];
