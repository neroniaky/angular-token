"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var angular2_token_service_1 = require("../../angular2-token.service");
var a2t_shared_1 = require("../a2t-shared");
var _1 = require("../");
var A2tSignUpComponent = (function () {
    function A2tSignUpComponent(_formService, _sessionService, _router) {
        var _this = this;
        this._formService = _formService;
        this._sessionService = _sessionService;
        this._router = _router;
        this._formService.initForm(_1.SIGN_UP_FORM);
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
    A2tSignUpComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'a2t-sign-up',
                    providers: [a2t_shared_1.A2tFormService],
                    template: "\n        <a2t-headline>Sign Up</a2t-headline>\n        <a2t-error [errors]=\"_errors\"></a2t-error>\n        <a2t-form>Sign Up</a2t-form>\n        <a2t-links case=\"sign-up\"></a2t-links>\n    "
                },] },
    ];
    /** @nocollapse */
    A2tSignUpComponent.ctorParameters = function () { return [
        { type: a2t_shared_1.A2tFormService, },
        { type: angular2_token_service_1.Angular2TokenService, },
        { type: router_1.Router, },
    ]; };
    return A2tSignUpComponent;
}());
exports.A2tSignUpComponent = A2tSignUpComponent;
//# sourceMappingURL=a2t-sign-up.component.js.map