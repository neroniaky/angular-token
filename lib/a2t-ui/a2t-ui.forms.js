import { Validators } from '@angular/forms';
var BaseField = (function () {
    function BaseField(options) {
        if (options === void 0) { options = {}; }
        this.value = options.value;
        this.key = options.key || '';
        this.label = options.label || '';
        this.validators = options.validators === undefined ? [] : options.validators;
        this.type = options.type || '';
    }
    return BaseField;
}());
export { BaseField };
export var SIGN_IN_FORM = [
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
export var SIGN_UP_FORM = [
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
export var RESET_PASSWORD_FORM = [
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
export var UPDATE_PASSWORD_FORM = [
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
//# sourceMappingURL=a2t-ui.forms.js.map