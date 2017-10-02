"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
require("rxjs/add/operator/share");
require("rxjs/add/observable/interval");
require("rxjs/add/observable/fromEvent");
require("rxjs/add/operator/pluck");
require("rxjs/add/operator/filter");
var Angular2TokenService = (function () {
    function Angular2TokenService(http, activatedRoute, router) {
        this.http = http;
        this.activatedRoute = activatedRoute;
        this.router = router;
    }
    Object.defineProperty(Angular2TokenService.prototype, "currentUserType", {
        get: function () {
            if (this.atCurrentUserType != null)
                return this.atCurrentUserType.name;
            else
                return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Angular2TokenService.prototype, "currentUserData", {
        get: function () {
            return this.atCurrentUserData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Angular2TokenService.prototype, "currentAuthData", {
        get: function () {
            return this.atCurrentAuthData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Angular2TokenService.prototype, "currentAuthHeaders", {
        get: function () {
            if (this.atCurrentAuthData != null) {
                return new http_1.Headers({
                    'access-token': this.atCurrentAuthData.accessToken,
                    'client': this.atCurrentAuthData.client,
                    'expiry': this.atCurrentAuthData.expiry,
                    'token-type': this.atCurrentAuthData.tokenType,
                    'uid': this.atCurrentAuthData.uid
                });
            }
            return new http_1.Headers;
        },
        enumerable: true,
        configurable: true
    });
    Angular2TokenService.prototype.userSignedIn = function () {
        return !!this.atCurrentAuthData;
    };
    Angular2TokenService.prototype.canActivate = function () {
        if (this.userSignedIn())
            return true;
        else {
            // Store current location in storage (usefull for redirection after signing in)
            if (this.atOptions.signInStoredUrlStorageKey) {
                localStorage.setItem(this.atOptions.signInStoredUrlStorageKey, window.location.pathname + window.location.search);
            }
            // Redirect user to sign in if signInRedirect is set
            if (this.router && this.atOptions.signInRedirect)
                this.router.navigate([this.atOptions.signInRedirect]);
            return false;
        }
    };
    // Inital configuration
    Angular2TokenService.prototype.init = function (options) {
        var defaultOptions = {
            apiPath: null,
            apiBase: null,
            signInPath: 'auth/sign_in',
            signInRedirect: null,
            signInStoredUrlStorageKey: null,
            signOutPath: 'auth/sign_out',
            validateTokenPath: 'auth/validate_token',
            signOutFailedValidate: false,
            registerAccountPath: 'auth',
            deleteAccountPath: 'auth',
            registerAccountCallback: window.location.href,
            updatePasswordPath: 'auth',
            resetPasswordPath: 'auth/password',
            resetPasswordCallback: window.location.href,
            userTypes: null,
            oAuthBase: window.location.origin,
            oAuthPaths: {
                github: 'auth/github'
            },
            oAuthCallbackPath: 'oauth_callback',
            oAuthWindowType: 'newWindow',
            oAuthWindowOptions: null,
            globalOptions: {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        };
        this.atOptions = Object.assign(defaultOptions, options);
        this.tryLoadAuthData();
    };
    /**
     *
     * Actions
     *
     */
    // Register request
    Angular2TokenService.prototype.registerAccount = function (registerData) {
        if (registerData.userType == null)
            this.atCurrentUserType = null;
        else {
            this.atCurrentUserType = this.getUserTypeByName(registerData.userType);
            delete registerData.userType;
        }
        registerData.password_confirmation = registerData.passwordConfirmation;
        delete registerData.passwordConfirmation;
        registerData.confirm_success_url = this.atOptions.registerAccountCallback;
        return this.post(this.getUserPath() + this.atOptions.registerAccountPath, JSON.stringify(registerData));
    };
    // Delete Account
    Angular2TokenService.prototype.deleteAccount = function () {
        return this.delete(this.getUserPath() + this.atOptions.deleteAccountPath);
    };
    // Sign in request and set storage
    Angular2TokenService.prototype.signIn = function (signInData) {
        var _this = this;
        if (signInData.userType == null)
            this.atCurrentUserType = null;
        else
            this.atCurrentUserType = this.getUserTypeByName(signInData.userType);
        var body = JSON.stringify({
            email: signInData.email,
            password: signInData.password
        });
        var observ = this.post(this.getUserPath() + this.atOptions.signInPath, body);
        observ.subscribe(function (res) { return _this.atCurrentUserData = res.json().data; }, function (_error) { return null; });
        return observ;
    };
    Angular2TokenService.prototype.signInOAuth = function (oAuthType) {
        var oAuthPath = this.getOAuthPath(oAuthType);
        var callbackUrl = window.location.origin + "/" + this.atOptions.oAuthCallbackPath;
        var oAuthWindowType = this.atOptions.oAuthWindowType;
        var authUrl = this.getOAuthUrl(oAuthPath, callbackUrl, oAuthWindowType);
        if (oAuthWindowType == 'newWindow') {
            var oAuthWindowOptions = this.atOptions.oAuthWindowOptions;
            var windowOptions = '';
            if (oAuthWindowOptions) {
                for (var key in oAuthWindowOptions) {
                    windowOptions += "," + key + "=" + oAuthWindowOptions[key];
                }
            }
            var popup = window.open(authUrl, '_blank', "closebuttoncaption=Cancel" + windowOptions);
            return this.requestCredentialsViaPostMessage(popup);
        }
        else if (oAuthWindowType == 'sameWindow') {
            window.location.href = authUrl;
        }
        else {
            throw "Unsupported oAuthWindowType \"" + oAuthWindowType + "\"";
        }
    };
    Angular2TokenService.prototype.processOAuthCallback = function () {
        this.getAuthDataFromParams();
    };
    // Sign out request and delete storage
    Angular2TokenService.prototype.signOut = function () {
        var observ = this.delete(this.getUserPath() + this.atOptions.signOutPath);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('client');
        localStorage.removeItem('expiry');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('uid');
        this.atCurrentAuthData = null;
        this.atCurrentUserType = null;
        this.atCurrentUserData = null;
        return observ;
    };
    // Validate token request
    Angular2TokenService.prototype.validateToken = function () {
        var _this = this;
        var observ = this.get(this.getUserPath() + this.atOptions.validateTokenPath);
        observ.subscribe(function (res) { return _this.atCurrentUserData = res.json().data; }, function (error) {
            if (error.status === 401 && _this.atOptions.signOutFailedValidate) {
                _this.signOut();
            }
        });
        return observ;
    };
    // Update password request
    Angular2TokenService.prototype.updatePassword = function (updatePasswordData) {
        if (updatePasswordData.userType != null)
            this.atCurrentUserType = this.getUserTypeByName(updatePasswordData.userType);
        var args;
        if (updatePasswordData.passwordCurrent == null) {
            args = {
                password: updatePasswordData.password,
                password_confirmation: updatePasswordData.passwordConfirmation
            };
        }
        else {
            args = {
                current_password: updatePasswordData.passwordCurrent,
                password: updatePasswordData.password,
                password_confirmation: updatePasswordData.passwordConfirmation
            };
        }
        if (updatePasswordData.resetPasswordToken) {
            args.reset_password_token = updatePasswordData.resetPasswordToken;
        }
        var body = JSON.stringify(args);
        return this.put(this.getUserPath() + this.atOptions.updatePasswordPath, body);
    };
    // Reset password request
    Angular2TokenService.prototype.resetPassword = function (resetPasswordData) {
        if (resetPasswordData.userType == null)
            this.atCurrentUserType = null;
        else
            this.atCurrentUserType = this.getUserTypeByName(resetPasswordData.userType);
        var body = JSON.stringify({
            email: resetPasswordData.email,
            redirect_url: this.atOptions.resetPasswordCallback
        });
        return this.post(this.getUserPath() + this.atOptions.resetPasswordPath, body);
    };
    /**
     *
     * HTTP Wrappers
     *
     */
    Angular2TokenService.prototype.get = function (url, options) {
        return this.request(this.mergeRequestOptionsArgs({
            url: this.getApiPath() + url,
            method: http_1.RequestMethod.Get
        }, options));
    };
    Angular2TokenService.prototype.post = function (url, body, options) {
        return this.request(this.mergeRequestOptionsArgs({
            url: this.getApiPath() + url,
            method: http_1.RequestMethod.Post,
            body: body
        }, options));
    };
    Angular2TokenService.prototype.put = function (url, body, options) {
        return this.request(this.mergeRequestOptionsArgs({
            url: this.getApiPath() + url,
            method: http_1.RequestMethod.Put,
            body: body
        }, options));
    };
    Angular2TokenService.prototype.delete = function (url, options) {
        return this.request(this.mergeRequestOptionsArgs({
            url: this.getApiPath() + url,
            method: http_1.RequestMethod.Delete
        }, options));
    };
    Angular2TokenService.prototype.patch = function (url, body, options) {
        return this.request(this.mergeRequestOptionsArgs({
            url: this.getApiPath() + url,
            method: http_1.RequestMethod.Patch,
            body: body
        }, options));
    };
    Angular2TokenService.prototype.head = function (path, options) {
        return this.request({
            method: http_1.RequestMethod.Head,
            url: this.getApiPath() + path
        });
    };
    Angular2TokenService.prototype.options = function (url, options) {
        return this.request(this.mergeRequestOptionsArgs({
            url: this.getApiPath() + url,
            method: http_1.RequestMethod.Options
        }, options));
    };
    // Construct and send Http request
    Angular2TokenService.prototype.request = function (options) {
        var baseRequestOptions;
        var baseHeaders = this.atOptions.globalOptions.headers;
        // Get auth data from local storage
        this.getAuthDataFromStorage();
        // Merge auth headers to request if set
        if (this.atCurrentAuthData != null) {
            Object.assign(baseHeaders, {
                'access-token': this.atCurrentAuthData.accessToken,
                'client': this.atCurrentAuthData.client,
                'expiry': this.atCurrentAuthData.expiry,
                'token-type': this.atCurrentAuthData.tokenType,
                'uid': this.atCurrentAuthData.uid
            });
        }
        baseRequestOptions = new http_1.RequestOptions({
            headers: new http_1.Headers(baseHeaders)
        });
        // Merge standard and custom RequestOptions
        baseRequestOptions = baseRequestOptions.merge(options);
        var response = this.http.request(new http_1.Request(baseRequestOptions)).share();
        this.handleResponse(response);
        return response;
    };
    Angular2TokenService.prototype.mergeRequestOptionsArgs = function (options, addOptions) {
        var returnOptions = options;
        if (options)
            Object.assign(returnOptions, addOptions);
        return returnOptions;
    };
    // Check if response is complete and newer, then update storage
    Angular2TokenService.prototype.handleResponse = function (response) {
        var _this = this;
        response.subscribe(function (res) {
            _this.getAuthHeadersFromResponse(res);
        }, function (error) {
            _this.getAuthHeadersFromResponse(error);
        });
    };
    /**
     *
     * Get Auth Data
     *
     */
    // Try to load auth data
    Angular2TokenService.prototype.tryLoadAuthData = function () {
        var userType = this.getUserTypeByName(localStorage.getItem('userType'));
        if (userType)
            this.atCurrentUserType = userType;
        this.getAuthDataFromStorage();
        if (this.activatedRoute)
            this.getAuthDataFromParams();
        if (this.atCurrentAuthData)
            this.validateToken();
    };
    // Parse Auth data from response
    Angular2TokenService.prototype.getAuthHeadersFromResponse = function (data) {
        var headers = data.headers;
        var authData = {
            accessToken: headers.get('access-token'),
            client: headers.get('client'),
            expiry: headers.get('expiry'),
            tokenType: headers.get('token-type'),
            uid: headers.get('uid')
        };
        this.setAuthData(authData);
    };
    // Parse Auth data from post message
    Angular2TokenService.prototype.getAuthDataFromPostMessage = function (data) {
        var authData = {
            accessToken: data['auth_token'],
            client: data['client_id'],
            expiry: data['expiry'],
            tokenType: 'Bearer',
            uid: data['uid']
        };
        this.setAuthData(authData);
    };
    // Try to get auth data from storage.
    Angular2TokenService.prototype.getAuthDataFromStorage = function () {
        var authData = {
            accessToken: localStorage.getItem('accessToken'),
            client: localStorage.getItem('client'),
            expiry: localStorage.getItem('expiry'),
            tokenType: localStorage.getItem('tokenType'),
            uid: localStorage.getItem('uid')
        };
        if (this.checkAuthData(authData))
            this.atCurrentAuthData = authData;
    };
    // Try to get auth data from url parameters.
    Angular2TokenService.prototype.getAuthDataFromParams = function () {
        var _this = this;
        if (this.activatedRoute.queryParams)
            this.activatedRoute.queryParams.subscribe(function (queryParams) {
                var authData = {
                    accessToken: queryParams['token'] || queryParams['auth_token'],
                    client: queryParams['client_id'],
                    expiry: queryParams['expiry'],
                    tokenType: 'Bearer',
                    uid: queryParams['uid']
                };
                if (_this.checkAuthData(authData))
                    _this.atCurrentAuthData = authData;
            });
    };
    /**
     *
     * Set Auth Data
     *
     */
    // Write auth data to storage
    Angular2TokenService.prototype.setAuthData = function (authData) {
        if (this.checkAuthData(authData)) {
            this.atCurrentAuthData = authData;
            localStorage.setItem('accessToken', authData.accessToken);
            localStorage.setItem('client', authData.client);
            localStorage.setItem('expiry', authData.expiry);
            localStorage.setItem('tokenType', authData.tokenType);
            localStorage.setItem('uid', authData.uid);
            if (this.atCurrentUserType != null)
                localStorage.setItem('userType', this.atCurrentUserType.name);
        }
    };
    /**
     *
     * Validate Auth Data
     *
     */
    // Check if auth data complete and if response token is newer
    Angular2TokenService.prototype.checkAuthData = function (authData) {
        if (authData.accessToken != null &&
            authData.client != null &&
            authData.expiry != null &&
            authData.tokenType != null &&
            authData.uid != null) {
            if (this.atCurrentAuthData != null)
                return authData.expiry >= this.atCurrentAuthData.expiry;
            else
                return true;
        }
        else {
            return false;
        }
    };
    /**
     *
     * Construct Paths / Urls
     *
     */
    Angular2TokenService.prototype.getUserPath = function () {
        if (this.atCurrentUserType == null)
            return '';
        else
            return this.atCurrentUserType.path + '/';
    };
    Angular2TokenService.prototype.getApiPath = function () {
        var constructedPath = '';
        if (this.atOptions.apiBase != null)
            constructedPath += this.atOptions.apiBase + '/';
        if (this.atOptions.apiPath != null)
            constructedPath += this.atOptions.apiPath + '/';
        return constructedPath;
    };
    Angular2TokenService.prototype.getOAuthPath = function (oAuthType) {
        var oAuthPath;
        oAuthPath = this.atOptions.oAuthPaths[oAuthType];
        if (oAuthPath == null)
            oAuthPath = "/auth/" + oAuthType;
        return oAuthPath;
    };
    Angular2TokenService.prototype.getOAuthUrl = function (oAuthPath, callbackUrl, windowType) {
        var url;
        url = this.atOptions.oAuthBase + "/" + oAuthPath;
        url += "?omniauth_window_type=" + windowType;
        url += "&auth_origin_url=" + encodeURIComponent(callbackUrl);
        if (this.atCurrentUserType != null)
            url += "&resource_class=" + this.atCurrentUserType.name;
        return url;
    };
    /**
     *
     * OAuth
     *
     */
    Angular2TokenService.prototype.requestCredentialsViaPostMessage = function (authWindow) {
        var pollerObserv = Observable_1.Observable.interval(500);
        var responseObserv = Observable_1.Observable.fromEvent(window, 'message').pluck('data')
            .filter(this.oAuthWindowResponseFilter);
        var responseSubscription = responseObserv.subscribe(this.getAuthDataFromPostMessage.bind(this));
        var pollerSubscription = pollerObserv.subscribe(function () {
            if (authWindow.closed)
                pollerSubscription.unsubscribe();
            else
                authWindow.postMessage('requestCredentials', '*');
        });
        return responseObserv;
    };
    Angular2TokenService.prototype.oAuthWindowResponseFilter = function (data) {
        if (data.message == 'deliverCredentials' || data.message == 'authFailure')
            return data;
    };
    /**
     *
     * Utilities
     *
     */
    // Match user config by user config name
    Angular2TokenService.prototype.getUserTypeByName = function (name) {
        if (name == null || this.atOptions.userTypes == null)
            return null;
        return this.atOptions.userTypes.find(function (userType) { return userType.name === name; });
    };
    Angular2TokenService.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    Angular2TokenService.ctorParameters = function () { return [
        { type: http_1.Http, },
        { type: router_1.ActivatedRoute, decorators: [{ type: core_1.Optional },] },
        { type: router_1.Router, decorators: [{ type: core_1.Optional },] },
    ]; };
    return Angular2TokenService;
}());
exports.Angular2TokenService = Angular2TokenService;
//# sourceMappingURL=angular2-token.service.js.map