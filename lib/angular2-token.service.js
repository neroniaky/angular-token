"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
require('rxjs/add/operator/share');
var Angular2TokenService = (function () {
    function Angular2TokenService(_http, _activatedRoute, _router) {
        this._http = _http;
        this._activatedRoute = _activatedRoute;
        this._router = _router;
    }
    Object.defineProperty(Angular2TokenService.prototype, "currentUserType", {
        get: function () {
            if (this._currentUserType != null)
                return this._currentUserType.name;
            else
                return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Angular2TokenService.prototype, "currentUserData", {
        get: function () {
            return this._currentUserData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Angular2TokenService.prototype, "currentAuthData", {
        get: function () {
            return this._currentAuthData;
        },
        enumerable: true,
        configurable: true
    });
    Angular2TokenService.prototype.userSignedIn = function () {
        return !!this._currentAuthData;
    };
    Angular2TokenService.prototype.canActivate = function () {
        if (this.userSignedIn())
            return true;
        else {
            // Store current URL for later redirect to the request page
            if (this._options.signInStoredUrlStorageKey) {
                localStorage.setItem(this._options.signInStoredUrlStorageKey, window.location.pathname + window.location.search);
            }
            // Redirect user to sign in if signInRedirect is set
            if (this._options.signInRedirect)
                this._router.navigate([this._options.signInRedirect]);
            return false;
        }
    };
    // Inital configuration
    Angular2TokenService.prototype.init = function (options) {
        var defaultOptions = {
            apiPath: null,
            signInPath: 'auth/sign_in',
            signInRedirect: null,
            signOutPath: 'auth/sign_out',
            validateTokenPath: 'auth/validate_token',
            registerAccountPath: 'auth',
            deleteAccountPath: 'auth',
            registerAccountCallback: window.location.href,
            updatePasswordPath: 'auth',
            resetPasswordPath: 'auth/password',
            resetPasswordCallback: window.location.href,
            userTypes: null,
            oAuthPaths: {
                github: 'auth/github'
            },
            globalOptions: {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        };
        this._options = Object.assign(defaultOptions, options);
        this._tryLoadAuthData();
    };
    // Register request
    Angular2TokenService.prototype.registerAccount = function (email, password, passwordConfirmation, userType) {
        if (userType == null)
            this._currentUserType = null;
        else
            this._currentUserType = this._getUserTypeByName(userType);
        var body = JSON.stringify({
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
            confirm_success_url: this._options.registerAccountCallback
        });
        return this.post(this._constructUserPath() + this._options.registerAccountPath, body);
    };
    // Delete Account
    Angular2TokenService.prototype.deleteAccount = function () {
        return this.delete(this._constructUserPath() + this._options.deleteAccountPath);
    };
    // Sign in request and set storage
    Angular2TokenService.prototype.signIn = function (email, password, userType) {
        var _this = this;
        if (userType == null)
            this._currentUserType = null;
        else
            this._currentUserType = this._getUserTypeByName(userType);
        var body = JSON.stringify({
            email: email,
            password: password
        });
        var observ = this.post(this._constructUserPath() + this._options.signInPath, body);
        observ.subscribe(function (res) { return _this._currentUserData = res.json().data; }, function (error) { return null; });
        return observ;
    };
    Angular2TokenService.prototype.signInOAuth = function (oAuthType) {
        var oAuthPath;
        if (oAuthType == 'github') {
            oAuthPath = this._options.oAuthPaths.github;
        }
        window.open(this._constructUserPath() + oAuthPath);
    };
    // Sign out request and delete storage
    Angular2TokenService.prototype.signOut = function () {
        var observ = this.delete(this._constructUserPath() + this._options.signOutPath);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('client');
        localStorage.removeItem('expiry');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('uid');
        this._currentAuthData = null;
        this._currentUserType = null;
        this._currentUserData = null;
        return observ;
    };
    // Validate token request
    Angular2TokenService.prototype.validateToken = function () {
        var _this = this;
        var observ = this.get(this._constructUserPath() + this._options.validateTokenPath);
        observ.subscribe(function (res) { return _this._currentUserData = res.json().data; }, function (error) { return null; });
        return observ;
    };
    // Update password request
    Angular2TokenService.prototype.updatePassword = function (password, passwordConfirmation, currentPassword, userType) {
        if (userType != null)
            this._currentUserType = this._getUserTypeByName(userType);
        var body;
        if (currentPassword == null) {
            body = JSON.stringify({
                password: password,
                password_confirmation: passwordConfirmation
            });
        }
        else {
            body = JSON.stringify({
                current_password: currentPassword,
                password: password,
                password_confirmation: passwordConfirmation
            });
        }
        return this.put(this._constructUserPath() + this._options.updatePasswordPath, body);
    };
    // Reset password request
    Angular2TokenService.prototype.resetPassword = function (email, userType) {
        if (userType == null)
            this._currentUserType = null;
        else
            this._currentUserType = this._getUserTypeByName(userType);
        var body = JSON.stringify({
            email: email,
            redirect_url: this._options.resetPasswordCallback
        });
        return this.post(this._constructUserPath() + this._options.resetPasswordPath, body);
    };
    // Standard HTTP requests
    Angular2TokenService.prototype.get = function (path) {
        return this.sendHttpRequest(new http_1.RequestOptions({
            method: http_1.RequestMethod.Get,
            url: this._constructApiPath() + path
        }));
    };
    Angular2TokenService.prototype.post = function (path, data) {
        return this.sendHttpRequest(new http_1.RequestOptions({
            method: http_1.RequestMethod.Post,
            url: this._constructApiPath() + path,
            body: data
        }));
    };
    Angular2TokenService.prototype.put = function (path, data) {
        return this.sendHttpRequest(new http_1.RequestOptions({
            method: http_1.RequestMethod.Put,
            url: this._constructApiPath() + path,
            body: data
        }));
    };
    Angular2TokenService.prototype.delete = function (path) {
        return this.sendHttpRequest(new http_1.RequestOptions({
            method: http_1.RequestMethod.Delete,
            url: this._constructApiPath() + path
        }));
    };
    Angular2TokenService.prototype.patch = function (path, data) {
        return this.sendHttpRequest(new http_1.RequestOptions({
            method: http_1.RequestMethod.Patch,
            url: this._constructApiPath() + path,
            body: data
        }));
    };
    Angular2TokenService.prototype.head = function (path) {
        return this.sendHttpRequest(new http_1.RequestOptions({
            method: http_1.RequestMethod.Head,
            url: this._constructApiPath() + path
        }));
    };
    Angular2TokenService.prototype.options = function (path) {
        return this.sendHttpRequest(new http_1.RequestOptions({
            method: http_1.RequestMethod.Options,
            url: this._constructApiPath() + path
        }));
    };
    // Construct and send Http request
    Angular2TokenService.prototype.sendHttpRequest = function (requestOptions) {
        var baseRequestOptions;
        var baseHeaders = this._options.globalOptions.headers;
        // Merge auth headers to request if set
        if (this._currentAuthData != null) {
            Object.assign(baseHeaders, {
                'access-token': this._currentAuthData.accessToken,
                'client': this._currentAuthData.client,
                'expiry': this._currentAuthData.expiry,
                'token-type': this._currentAuthData.tokenType,
                'uid': this._currentAuthData.uid
            });
        }
        baseRequestOptions = new http_1.RequestOptions({
            headers: new http_1.Headers(baseHeaders)
        });
        // Merge standard and custom RequestOptions
        baseRequestOptions = baseRequestOptions.merge(requestOptions);
        var response = this._http.request(new http_1.Request(baseRequestOptions)).share();
        this._handleResponse(response);
        return response;
    };
    // Check if response is complete and newer, then update storage
    Angular2TokenService.prototype._handleResponse = function (response) {
        var _this = this;
        response.subscribe(function (res) {
            _this._parseAuthHeadersFromResponse(res);
        }, function (error) {
            _this._parseAuthHeadersFromResponse(error);
            console.log('Session Service: Error Fetching Response');
        });
    };
    Angular2TokenService.prototype._parseAuthHeadersFromResponse = function (data) {
        var headers = data.headers;
        var authData = {
            accessToken: headers.get('access-token'),
            client: headers.get('client'),
            expiry: headers.get('expiry'),
            tokenType: headers.get('token-type'),
            uid: headers.get('uid')
        };
        this._setAuthData(authData);
    };
    // Try to get auth data from storage.
    Angular2TokenService.prototype._getAuthDataFromStorage = function () {
        var authData = {
            accessToken: localStorage.getItem('accessToken'),
            client: localStorage.getItem('client'),
            expiry: localStorage.getItem('expiry'),
            tokenType: localStorage.getItem('tokenType'),
            uid: localStorage.getItem('uid')
        };
        if (this._checkIfComplete(authData))
            this._currentAuthData = authData;
    };
    // Try to get auth data from url parameters.
    Angular2TokenService.prototype._getAuthDataFromParams = function () {
        var _this = this;
        if (this._activatedRoute.queryParams)
            this._activatedRoute.queryParams.subscribe(function (queryParams) {
                var authData = {
                    accessToken: queryParams['token'],
                    client: queryParams['client_id'],
                    expiry: queryParams['expiry'],
                    tokenType: 'Bearer',
                    uid: queryParams['uid']
                };
                if (_this._checkIfComplete(authData))
                    _this._currentAuthData = authData;
            });
    };
    // Write auth data to storage
    Angular2TokenService.prototype._setAuthData = function (authData) {
        if (this._checkIfComplete(authData) && this._checkIfNewer(authData)) {
            this._currentAuthData = authData;
            localStorage.setItem('accessToken', authData.accessToken);
            localStorage.setItem('client', authData.client);
            localStorage.setItem('expiry', authData.expiry);
            localStorage.setItem('tokenType', authData.tokenType);
            localStorage.setItem('uid', authData.uid);
            if (this._currentUserType != null)
                localStorage.setItem('userType', this._currentUserType.name);
        }
    };
    // Check if auth data complete
    Angular2TokenService.prototype._checkIfComplete = function (authData) {
        if (authData.accessToken != null &&
            authData.client != null &&
            authData.expiry != null &&
            authData.tokenType != null &&
            authData.uid != null) {
            return true;
        }
        else {
            return false;
        }
    };
    // Check if response token is newer
    Angular2TokenService.prototype._checkIfNewer = function (authData) {
        if (this._currentAuthData != null)
            return authData.expiry >= this._currentAuthData.expiry;
        else
            return true;
    };
    // Try to load user config from storage
    Angular2TokenService.prototype._tryLoadAuthData = function () {
        var userType = this._getUserTypeByName(localStorage.getItem('userType'));
        if (userType)
            this._currentUserType = userType;
        this._getAuthDataFromStorage();
        this._getAuthDataFromParams();
        if (this._currentAuthData != null)
            this.validateToken();
    };
    // Match user config by user config name
    Angular2TokenService.prototype._getUserTypeByName = function (name) {
        if (name == null || this._options.userTypes == null)
            return null;
        return this._options.userTypes.find(function (userType) { return userType.name === name; });
    };
    Angular2TokenService.prototype._constructUserPath = function () {
        if (this._currentUserType == null)
            return '';
        else
            return this._currentUserType.path + '/';
    };
    Angular2TokenService.prototype._constructApiPath = function () {
        if (this._options.apiPath == null)
            return '';
        else
            return this._options.apiPath + '/';
    };
    Angular2TokenService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, router_1.ActivatedRoute, router_1.Router])
    ], Angular2TokenService);
    return Angular2TokenService;
}());
exports.Angular2TokenService = Angular2TokenService;
//# sourceMappingURL=angular2-token.service.js.map