import { Validators } from '@angular/forms';

import {
    BaseField
} from './';

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
        label: 'Passwort',
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
        label: 'Passwort',
        type: 'password',
        validators: [
            Validators.required,
            Validators.minLength(8)
        ]
    }),
    new BaseField({
        key: 'passwordConfirmation',
        label: 'Passwort Confirmation',
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
        label: 'Passwort',
        type: 'password',
        validators: [
            Validators.required,
            Validators.minLength(8)
        ]
    }),
    new BaseField({
        key: 'passwordConfirmation',
        label: 'Passwort Confirmation',
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