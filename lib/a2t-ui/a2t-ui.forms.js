"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
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
exports.BaseField = BaseField;
exports.SIGN_IN_FORM = [
    new BaseField({
        key: 'email',
        label: 'Email',
        type: 'text',
        validators: [
            forms_1.Validators.required,
            forms_1.Validators.minLength(8)
        ]
    }),
    new BaseField({
        key: 'password',
        label: 'Password',
        type: 'password',
        validators: [
            forms_1.Validators.required,
            forms_1.Validators.minLength(8)
        ]
    })
];
exports.SIGN_UP_FORM = [
    new BaseField({
        key: 'email',
        label: 'Email',
        type: 'text',
        validators: [
            forms_1.Validators.required,
            forms_1.Validators.minLength(8)
        ]
    }),
    new BaseField({
        key: 'password',
        label: 'Password',
        type: 'password',
        validators: [
            forms_1.Validators.required,
            forms_1.Validators.minLength(8)
        ]
    }),
    new BaseField({
        key: 'passwordConfirmation',
        label: 'Password Confirmation',
        type: 'password',
        validators: [
            forms_1.Validators.required,
            forms_1.Validators.minLength(8)
        ]
    })
];
exports.RESET_PASSWORD_FORM = [
    new BaseField({
        key: 'email',
        label: 'Email',
        type: 'text',
        validators: [
            forms_1.Validators.required,
            forms_1.Validators.minLength(8)
        ]
    })
];
exports.UPDATE_PASSWORD_FORM = [
    new BaseField({
        key: 'password',
        label: 'Password',
        type: 'password',
        validators: [
            forms_1.Validators.required,
            forms_1.Validators.minLength(8)
        ]
    }),
    new BaseField({
        key: 'passwordConfirmation',
        label: 'Password Confirmation',
        type: 'password',
        validators: [
            forms_1.Validators.required,
            forms_1.Validators.minLength(8)
        ]
    }),
    new BaseField({
        key: 'passwordCurrent',
        label: 'Old Password',
        type: 'password',
        validators: [
            forms_1.Validators.required,
            forms_1.Validators.minLength(8)
        ]
    })
];
//# sourceMappingURL=a2t-ui.forms.js.map