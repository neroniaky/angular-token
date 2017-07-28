import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2TokenService } from '../../angular2-token.service';
import { A2tFormService } from '../a2t-shared';
import { SIGN_UP_FORM } from '../';
var A2tSignUpComponent = (function () {
    function A2tSignUpComponent(_formService, _sessionService, _router) {
        var _this = this;
        this._formService = _formService;
        this._sessionService = _sessionService;
        this._router = _router;
        this._formService.initForm(SIGN_UP_FORM);
        this._formService.submit$.subscribe(function (data) { return _this._sessionService.registerAccount(data).subscribe(function (res) { return _this._handleSuccess(res); }, function (error) { return _this._handleError(error); }); });
    }
    A2tSignUpComponent.prototype._handleSuccess = function (data) {
        this._errors = null;
        this._formService.unlockSubmit();
        this._router.navigate(['restricted']);
    };
    A2tSignUpComponent.prototype._handleError = function (error) {
        this._errors = error.json().errors.full_messages;
        this._formService.unlockSubmit();
    };
    return A2tSignUpComponent;
}());
export { A2tSignUpComponent };
A2tSignUpComponent.decorators = [
    { type: Component, args: [{
                selector: 'a2t-sign-up',
                providers: [A2tFormService],
                template: "\n        <a2t-headline>Sign Up</a2t-headline>\n        <a2t-error [errors]=\"_errors\"></a2t-error>\n        <a2t-form>Sign Up</a2t-form>\n        <a2t-links case=\"sign-up\"></a2t-links>\n    "
            },] },
];
/** @nocollapse */
A2tSignUpComponent.ctorParameters = function () { return [
    { type: A2tFormService, },
    { type: Angular2TokenService, },
    { type: Router, },
]; };
//# sourceMappingURL=a2t-sign-up.component.js.map