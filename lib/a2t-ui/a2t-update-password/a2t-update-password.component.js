"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var angular2_token_service_1 = require("../../angular2-token.service");
var a2t_shared_1 = require("../a2t-shared");
var _1 = require("../");
var A2tUpdatePasswordComponent = (function () {
    function A2tUpdatePasswordComponent(_formService, _sessionService, _router) {
        var _this = this;
        this._formService = _formService;
        this._sessionService = _sessionService;
        this._router = _router;
        this._formService.initForm(_1.UPDATE_PASSWORD_FORM);
        this._formService.submit$.subscribe(function (data) { return _this._sessionService.updatePassword(data).subscribe(function (res) { return _this._handleSuccess(res); }, function (error) { return _this._handleError(error); }); });
    }
    A2tUpdatePasswordComponent.prototype._handleSuccess = function (data) {
        this._router.navigate(['session/sign-in']);
    };
    A2tUpdatePasswordComponent.prototype._handleError = function (error) {
        this._errors = error.json().errors;
        this._formService.unlockSubmit();
    };
    A2tUpdatePasswordComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'a2t-update-password',
                    providers: [a2t_shared_1.A2tFormService],
                    template: "\n        <a2t-headline>Update your Password</a2t-headline>\n        <a2t-error [errors]=\"_errors\"></a2t-error>\n        <a2t-form>Update Password</a2t-form>\n    "
                },] },
    ];
    /** @nocollapse */
    A2tUpdatePasswordComponent.ctorParameters = function () { return [
        { type: a2t_shared_1.A2tFormService, },
        { type: angular2_token_service_1.Angular2TokenService, },
        { type: router_1.Router, },
    ]; };
    return A2tUpdatePasswordComponent;
}());
exports.A2tUpdatePasswordComponent = A2tUpdatePasswordComponent;
//# sourceMappingURL=a2t-update-password.component.js.map