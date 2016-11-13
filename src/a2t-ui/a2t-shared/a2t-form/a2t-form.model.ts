export class BaseField{
    value: string;
    key: string;
    label: string;
    type: string;
    validators: any[];

    constructor(options: {
        value?: string,
        key?: string,
        label?: string,
        type?: string,
        validators?: any[],
    } = {}) {
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.validators = options.validators === undefined ? [] : options.validators;
        this.type = options.type || '';
    }
}