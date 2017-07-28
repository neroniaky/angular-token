import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2TokenService } from '../../angular2-token.service';
import { A2tFormService } from '../a2t-shared';
import { UPDATE_PASSWORD_FORM } from '../';
var A2tUpdatePasswordComponent = (function () {
    function A2tUpdatePasswordComponent(_formService, _sessionService, _router) {
        var _this = this;
        this._formService = _formService;
        this._sessionService = _sessionService;
        this._router = _router;
        this._formService.initForm(UPDATE_PASSWORD_FORM);
        this._formService.submit$.subscribe(function (data) { return _this._sessionService.updatePassword(data).subscribe(function (res) { return _this._handleSuccess(res); }, function (error) { return _this._handleError(error); }); });
    }
    A2tUpdatePasswordComponent.prototype._handleSuccess = function (data) {
        this._router.navigate(['session/sign-in']);
    };
    A2tUpdatePasswordComponent.prototype._handleError = function (error) {
        this._errors = error.json().errors;
        this._formService.unlockSubmit();
    };
    return A2tUpdatePasswordComponent;
}());
export { A2tUpdatePasswordComponent };
A2tUpdatePasswordComponent.decorators = [
    { type: Component, args: [{
                selector: 'a2t-update-password',
                providers: [A2tFormService],
                template: "\n        <a2t-headline>Update your Password</a2t-headline>\n        <a2t-error [errors]=\"_errors\"></a2t-error>\n        <a2t-form>Update Password</a2t-form>\n    "
            },] },
];
/** @nocollapse */
A2tUpdatePasswordComponent.ctorParameters = function () { return [
    { type: A2tFormService, },
    { type: Angular2TokenService, },
    { type: Router, },
]; };
//# sourceMappingURL=a2t-update-password.component.js.map