"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var angular2_token_service_1 = require("../../angular2-token.service");
var a2t_shared_1 = require("../a2t-shared");
var _1 = require("../");
var A2tSignInComponent = (function () {
    function A2tSignInComponent(_formService, _sessionService, _router) {
        var _this = this;
        this._formService = _formService;
        this._sessionService = _sessionService;
        this._router = _router;
        this._formService.initForm(_1.SIGN_IN_FORM);
        this._formService.submit$.subscribe(function (data) { return _this._sessionService.signIn(data).subscribe(function (res) { return _this._handleSuccess(res); }, function (error) { return _this._handleError(error); }); });
    }
    A2tSignInComponent.prototype._handleSuccess = function (data) {
        this._errors = null;
        this._formService.unlockSubmit();
        this._router.navigate(['restricted']);
    };
    A2tSignInComponent.prototype._handleError = function (error) {
        this._errors = error.json().errors;
        this._formService.unlockSubmit();
    };
    A2tSignInComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'a2t-sign-in',
                    providers: [a2t_shared_1.A2tFormService],
                    template: "\n        <a2t-headline>Sign In</a2t-headline>\n        <a2t-error [errors]=\"_errors\"></a2t-error>\n        <a2t-form>Sign In</a2t-form>\n        <a2t-links case=\"sign-in\"></a2t-links>\n    "
                },] },
    ];
    /** @nocollapse */
    A2tSignInComponent.ctorParameters = function () { return [
        { type: a2t_shared_1.A2tFormService, },
        { type: angular2_token_service_1.Angular2TokenService, },
        { type: router_1.Router, },
    ]; };
    return A2tSignInComponent;
}());
exports.A2tSignInComponent = A2tSignInComponent;
//# sourceMappingURL=a2t-sign-in.component.js.map