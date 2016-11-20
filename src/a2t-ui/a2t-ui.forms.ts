import { Validators } from '@angular/forms';

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

export const SIGN_IN_FORM: BaseField[] = [
    new BaseField({
        key: 'email',
        label: 'Email',
        type: 'text',
        validators: [
            Validators.required,
            Validators.minLength(8)
        ]
    }),
    new BaseField({
        key: 'password',
        label: 'Password',
        type: 'password',
        validators: [
            Validators.required,
            Validators.minLength(8)
        ]
    })
];

export const SIGN_UP_FORM: BaseField[] = [
    new BaseField({
        key: 'email',
        label: 'Email',
        type: 'text',
        validators: [
            Validators.required,
            Validators.minLength(8)
        ]
    }),
    new BaseField({
        key: 'password',
        label: 'Password',
        type: 'password',
        validators: [
            Validators.required,
            Validators.minLength(8)
        ]
    }),
    new BaseField({
        key: 'passwordConfirmation',
        label: 'Password Confirmation',
        type: 'password',
        validators: [
            Validators.required,
            Validators.minLength(8)
        ]
    })
];

export const RESET_PASSWORD_FORM: BaseField[] = [
    new BaseField({
        key: 'email',
        label: 'Email',
        type: 'text',
        validators: [
            Validators.required,
            Validators.minLength(8)
        ]
    })
];

export const UPDATE_PASSWORD_FORM: BaseField[] = [
    new BaseField({
        key: 'password',
        label: 'Password',
        type: 'password',
        validators: [
            Validators.required,
            Validators.minLength(8)
        ]
    }),
    new BaseField({
        key: 'passwordConfirmation',
        label: 'Password Confirmation',
        type: 'password',
        validators: [
            Validators.required,
            Validators.minLength(8)
        ]
    }),
    new BaseField({
        key: 'passwordCurrent',
        label: 'Old Password',
        type: 'password',
        validators: [
            Validators.required,
            Validators.minLength(8)
        ]
    })
];