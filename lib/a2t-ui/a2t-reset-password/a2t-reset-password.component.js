import { Component } from '@angular/core';
import { Angular2TokenService } from '../../angular2-token.service';
import { A2tFormService } from '../a2t-shared';
import { RESET_PASSWORD_FORM } from '../';
var A2tResetPasswordComponent = (function () {
    function A2tResetPasswordComponent(_formService, _sessionService) {
        var _this = this;
        this._formService = _formService;
        this._sessionService = _sessionService;
        this._emailSend = false;
        this._formService.initForm(RESET_PASSWORD_FORM);
        this._formService.submit$.subscribe(function (data) { return _this._sessionService.resetPassword(data).subscribe(function (res) { return _this._handleSuccess(); }, function (error) { return _this._handleError(); }); });
    }
    A2tResetPasswordComponent.prototype._handleSuccess = function () {
        this._emailSend = true;
    };
    A2tResetPasswordComponent.prototype._handleError = function () {
        this._emailSend = true;
    };
    return A2tResetPasswordComponent;
}());
export { A2tResetPasswordComponent };
A2tResetPasswordComponent.decorators = [
    { type: Component, args: [{
                selector: 'a2t-reset-password',
                providers: [A2tFormService],
                template: "\n        <a2t-headline *ngIf=\"!_emailSend\">Reset your Password</a2t-headline>\n        <a2t-form *ngIf=\"!_emailSend\">Reset Password</a2t-form>\n        <p class=\"email-send-text\" *ngIf=\"_emailSend\">\n            If the entered email is registered we will send instruction on how to reset your password.\n        </p>\n        <a2t-links *ngIf=\"!_emailSend\" case=\"reset-password\"></a2t-links>\n    ",
                styles: ["\n        .email-send-text {\n            background-color: #72c380;\n            color: white;\n            font-size: 16pt;\n            text-align: center;\n            padding: 20px;\n            border-radius: 3px;\n        }\n    "]
            },] },
];
/** @nocollapse */
A2tResetPasswordComponent.ctorParameters = function () { return [
    { type: A2tFormService, },
    { type: Angular2TokenService, },
]; };
//# sourceMappingURL=a2t-reset-password.component.js.map