import { Injectable, Optional } from '@angular/core';
import { ActivatedRoute, Router, CanActivate } from '@angular/router';
import {
    Http,
    Response,
    Headers,
    Request,
    RequestMethod,
    RequestOptions,
    RequestOptionsArgs
} from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/filter';

import {
    SignInData,
    RegisterData,
    UpdatePasswordData,
    ResetPasswordData,

    UserType,
    UserData,
    AuthData,

    Angular2TokenOptions
} from './angular2-token.model';

@Injectable()
export class Angular2TokenService implements CanActivate {

    get currentUserType(): string {
        if (this._currentUserType != null)
            return this._currentUserType.name;
        else
            return null;
    }

    get currentUserData(): UserData {
        return this._currentUserData;
    }

    get currentAuthData(): AuthData {
        return this._currentAuthData;
    }

    get currentAuthHeaders(): Headers {
        if (this._currentAuthData != null) {
            return new Headers({
                'access-token': this._currentAuthData.accessToken,
                'client':       this._currentAuthData.client,
                'expiry':       this._currentAuthData.expiry,
                'token-type':   this._currentAuthData.tokenType,
                'uid':          this._currentAuthData.uid
            });
        }

        return new Headers;
    }

    private _options: Angular2TokenOptions;
    private _currentUserType: UserType;
    private _currentAuthData: AuthData;
    private _currentUserData: UserData;

    constructor(
        private _http: Http,
        @Optional() private _activatedRoute: ActivatedRoute,
        @Optional() private _router: Router
    ) { }

    userSignedIn(): boolean {
        return !!this._currentAuthData;
    }

    canActivate() {
        if (this.userSignedIn())
            return true;
        else {
            // Store current location in storage (usefull for redirection after signing in)
            if (this._options.signInStoredUrlStorageKey) {
                localStorage.setItem(
                    this._options.signInStoredUrlStorageKey,
                    window.location.pathname + window.location.search
                );
            }

            // Redirect user to sign in if signInRedirect is set
            if(this._router && this._options.signInRedirect)
                this._router.navigate([this._options.signInRedirect]);

            return false;
        }
    }

    // Inital configuration
    init(options?: Angular2TokenOptions) {

        let defaultOptions: Angular2TokenOptions = {
            apiPath:                    null,
            apiBase:                    null,

            signInPath:                 'auth/sign_in',
            signInRedirect:             null,
            signInStoredUrlStorageKey:  null,

            signOutPath:                'auth/sign_out',
            validateTokenPath:          'auth/validate_token',
            signOutFailedValidate:      false,

            registerAccountPath:        'auth',
            deleteAccountPath:          'auth',
            registerAccountCallback:    window.location.href,

            updatePasswordPath:         'auth',

            resetPasswordPath:          'auth/password',
            resetPasswordCallback:      window.location.href,

            userTypes:                  null,

            oAuthBase:                  window.location.origin,
            oAuthPaths: {
                github:                 'auth/github'
            },
            oAuthCallbackPath:          'oauth_callback',
            oAuthWindowType:            'newWindow',
            oAuthWindowOptions:         null,

            globalOptions: {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':       'application/json'
                }
            }
        };

        this._options = (<any>Object).assign(defaultOptions, options);

        this._tryLoadAuthData();
    }

    /**
     *
     * Actions
     *
     */

    // Register request
    registerAccount(registerData: RegisterData): Observable<Response> {

        if (registerData.userType == null)
            this._currentUserType = null;
        else {
            this._currentUserType = this._getUserTypeByName(registerData.userType);
            delete registerData.userType;
        }

        registerData.password_confirmation  = registerData.passwordConfirmation;
        delete registerData.passwordConfirmation;

        registerData.confirm_success_url    = this._options.registerAccountCallback;

        return this.post(this._getUserPath() + this._options.registerAccountPath, JSON.stringify(registerData));
    }

    // Delete Account
    deleteAccount(): Observable<Response> {
        return this.delete(this._getUserPath() + this._options.deleteAccountPath);
    }

    // Sign in request and set storage
    signIn(signInData: SignInData): Observable<Response> {

        if (signInData.userType == null)
            this._currentUserType = null;
        else
            this._currentUserType = this._getUserTypeByName(signInData.userType);

        let body = JSON.stringify({
            email:      signInData.email,
            password:   signInData.password
        });

        let observ = this.post(this._getUserPath() + this._options.signInPath, body);

        observ.subscribe(res => this._currentUserData = res.json().data, _error => null);

        return observ;
    }

    signInOAuth(oAuthType: string) {

        let oAuthPath: string = this._getOAuthPath(oAuthType);
        let callbackUrl: string = `${window.location.origin}/${this._options.oAuthCallbackPath}`;
        let oAuthWindowType: string = this._options.oAuthWindowType;
        let authUrl: string = this._getOAuthUrl(oAuthPath, callbackUrl, oAuthWindowType);

        if (oAuthWindowType == 'newWindow') {
            let oAuthWindowOptions = this._options.oAuthWindowOptions;
            let windowOptions = '';

            if (oAuthWindowOptions) {
                for (let key in oAuthWindowOptions) {
                    windowOptions += `,${key}=${oAuthWindowOptions[key]}`;
                }
            }

            let popup = window.open(
                authUrl,
                '_blank',
                `closebuttoncaption=Cancel${windowOptions}`
            );
            return this._requestCredentialsViaPostMessage(popup);
        } else if (oAuthWindowType == 'sameWindow') {
            window.location.href = authUrl;
        } else {
            throw `Unsupported oAuthWindowType "${oAuthWindowType}"`;
        }
    }

    processOAuthCallback() {
        this._getAuthDataFromParams();
    }

    // Sign out request and delete storage
    signOut(): Observable<Response> {
        let observ = this.delete(this._getUserPath() + this._options.signOutPath);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('client');
        localStorage.removeItem('expiry');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('uid');

        this._currentAuthData = null;
        this._currentUserType = null;
        this._currentUserData = null;

        return observ;
    }

    // Validate token request
    validateToken(): Observable<Response> {
        let observ = this.get(this._getUserPath() + this._options.validateTokenPath);

        observ.subscribe(
            res => this._currentUserData = res.json().data,
            error => {
                if (error.status === 401 && this._options.signOutFailedValidate) {
                    this.signOut();
                }
            });

        return observ;
    }

    // Update password request
    updatePassword(updatePasswordData: UpdatePasswordData): Observable<Response> {

        if (updatePasswordData.userType != null)
            this._currentUserType = this._getUserTypeByName(updatePasswordData.userType);

        let args: any;

        if (updatePasswordData.passwordCurrent == null) {
            args = {
                password:               updatePasswordData.password,
                password_confirmation:  updatePasswordData.passwordConfirmation
            }
        } else {
            args = {
                current_password:       updatePasswordData.passwordCurrent,
                password:               updatePasswordData.password,
                password_confirmation:  updatePasswordData.passwordConfirmation
            };
        }

        if (updatePasswordData.resetPasswordToken) {
            args.reset_password_token = updatePasswordData.resetPasswordToken;
        }

        let body = JSON.stringify(args);
        return this.put(this._getUserPath() + this._options.updatePasswordPath, body);
    }

    // Reset password request
    resetPassword(resetPasswordData: ResetPasswordData): Observable<Response> {

        if (resetPasswordData.userType == null)
            this._currentUserType = null;
        else
            this._currentUserType = this._getUserTypeByName(resetPasswordData.userType);

        let body = JSON.stringify({
            email:          resetPasswordData.email,
            redirect_url:   this._options.resetPasswordCallback
        });

        return this.post(this._getUserPath() + this._options.resetPasswordPath, body);
    }

    /**
     *
     * HTTP Wrappers
     *
     */

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this._mergeRequestOptionsArgs({
            url:    this._getApiPath() + url,
            method: RequestMethod.Get
        }, options));
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this._mergeRequestOptionsArgs({
            url:    this._getApiPath() + url,
            method: RequestMethod.Post,
            body:   body
        }, options));
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this._mergeRequestOptionsArgs({
            url:    this._getApiPath() + url,
            method: RequestMethod.Put,
            body:   body
        }, options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this._mergeRequestOptionsArgs({
            url:    this._getApiPath() + url,
            method: RequestMethod.Delete
        }, options));
    }

    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this._mergeRequestOptionsArgs({
            url:    this._getApiPath() + url,
            method: RequestMethod.Patch,
            body:   body
        }, options));
    }

    head(path: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.request({
            method: RequestMethod.Head,
            url:    this._getApiPath() + path
        });
    }

    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this._mergeRequestOptionsArgs({
            url:    this._getApiPath() + url,
            method: RequestMethod.Options
        }, options));
    }

    // Construct and send Http request
    request(options: RequestOptionsArgs): Observable<Response> {

        let baseRequestOptions: RequestOptions;
        let baseHeaders:        { [key:string]: string; } = this._options.globalOptions.headers;

        // Merge auth headers to request if set
        if (this._currentAuthData != null) {
            (<any>Object).assign(baseHeaders, {
                'access-token': this._currentAuthData.accessToken,
                'client':       this._currentAuthData.client,
                'expiry':       this._currentAuthData.expiry,
                'token-type':   this._currentAuthData.tokenType,
                'uid':          this._currentAuthData.uid
            });
        }

        baseRequestOptions = new RequestOptions({
            headers: new Headers(baseHeaders)
        });

        // Merge standard and custom RequestOptions
        baseRequestOptions = baseRequestOptions.merge(options);

        let response = this._http.request(new Request(baseRequestOptions)).share();

        this._handleResponse(response);

        return response;
    }

    private _mergeRequestOptionsArgs(options: RequestOptionsArgs, addOptions?: RequestOptionsArgs): RequestOptionsArgs {

        let returnOptions: RequestOptionsArgs = options;

        if (options)
            (<any>Object).assign(returnOptions, addOptions);

        return returnOptions;
    }

    // Check if response is complete and newer, then update storage
    private _handleResponse(response: Observable<Response>) {
        response.subscribe(res => {
            this._getAuthHeadersFromResponse(<any>res);
        }, error => {
            this._getAuthHeadersFromResponse(<any>error);
        });
    }

    /**
     *
     * Get Auth Data
     *
     */

    // Try to load auth data
    private _tryLoadAuthData() {

        let userType = this._getUserTypeByName(localStorage.getItem('userType'));

        if (userType)
            this._currentUserType = userType;

        this._getAuthDataFromStorage();

        if(this._activatedRoute)
            this._getAuthDataFromParams();

        if (this._currentAuthData)
            this.validateToken();
    }

    // Parse Auth data from response
    private _getAuthHeadersFromResponse(data: any){
        let headers = data.headers;

        let authData: AuthData = {
            accessToken:    headers.get('access-token'),
            client:         headers.get('client'),
            expiry:         headers.get('expiry'),
            tokenType:      headers.get('token-type'),
            uid:            headers.get('uid')
        };

        this._setAuthData(authData);
    }

    // Parse Auth data from post message
    private _getAuthDataFromPostMessage(data: any){
        let authData: AuthData = {
            accessToken:    data['auth_token'],
            client:         data['client_id'],
            expiry:         data['expiry'],
            tokenType:      'Bearer',
            uid:            data['uid']
        };

        this._setAuthData(authData);
    }

    // Try to get auth data from storage.
    private _getAuthDataFromStorage() {

        let authData: AuthData = {
            accessToken:    localStorage.getItem('accessToken'),
            client:         localStorage.getItem('client'),
            expiry:         localStorage.getItem('expiry'),
            tokenType:      localStorage.getItem('tokenType'),
            uid:            localStorage.getItem('uid')
        };

        if (this._checkAuthData(authData))
            this._currentAuthData = authData;
    }

    // Try to get auth data from url parameters.
    private _getAuthDataFromParams() {
        if(this._activatedRoute.queryParams) // Fix for Testing, needs to be removed later
            this._activatedRoute.queryParams.subscribe(queryParams => {
                let authData: AuthData = {
                    accessToken:    queryParams['token'] || queryParams['auth_token'],
                    client:         queryParams['client_id'],
                    expiry:         queryParams['expiry'],
                    tokenType:      'Bearer',
                    uid:            queryParams['uid']
                };

                if (this._checkAuthData(authData))
                    this._currentAuthData = authData;
            });
    }

    /**
     *
     * Set Auth Data
     *
     */

    // Write auth data to storage
    private _setAuthData(authData: AuthData) {

        if (this._checkAuthData(authData)) {

            this._currentAuthData = authData;

            localStorage.setItem('accessToken', authData.accessToken);
            localStorage.setItem('client', authData.client);
            localStorage.setItem('expiry', authData.expiry);
            localStorage.setItem('tokenType', authData.tokenType);
            localStorage.setItem('uid', authData.uid);

            if (this._currentUserType != null)
                localStorage.setItem('userType', this._currentUserType.name);

        }
    }

    /**
     *
     * Validate Auth Data
     *
     */

    // Check if auth data complete and if response token is newer
    private _checkAuthData(authData: AuthData): boolean {

        if (
            authData.accessToken != null &&
            authData.client != null &&
            authData.expiry != null &&
            authData.tokenType != null &&
            authData.uid != null
        ) {
            if (this._currentAuthData != null)
                return authData.expiry >= this._currentAuthData.expiry;
            else
                return true;
        } else {
            return false;
        }
    }

    /**
     *
     * Construct Paths / Urls
     *
     */

    private _getUserPath(): string {
        if (this._currentUserType == null)
            return '';
        else
            return this._currentUserType.path + '/';
    }

    private _getApiPath(): string {
        let constructedPath = '';

        if (this._options.apiBase != null)
            constructedPath += this._options.apiBase + '/';

        if (this._options.apiPath != null)
            constructedPath += this._options.apiPath + '/';

        return constructedPath;
    }

    private _getOAuthPath(oAuthType: string): string {
        let oAuthPath: string;

        oAuthPath = this._options.oAuthPaths[oAuthType];

        if (oAuthPath == null)
            oAuthPath = `/auth/${oAuthType}`;

        return oAuthPath;
    }

    private _getOAuthUrl(oAuthPath: string, callbackUrl: string, windowType: string): string {
        let url: string;

        url =   `${this._options.oAuthBase}/${oAuthPath}`;
        url +=  `?omniauth_window_type=${windowType}`;
        url +=  `&auth_origin_url=${encodeURIComponent(callbackUrl)}`;

        if (this._currentUserType != null)
            url += `&resource_class=${this._currentUserType.name}`;

        return url;
    }

    /**
     *
     * OAuth
     *
     */

    private _requestCredentialsViaPostMessage(authWindow: any): Observable<any> {
        let pollerObserv = Observable.interval(500);

        let responseObserv = Observable.fromEvent(window, 'message').pluck('data')
            .filter(this._oAuthWindowResponseFilter);

        let responseSubscription = responseObserv.subscribe(
            this._getAuthDataFromPostMessage.bind(this)
        );

        let pollerSubscription = pollerObserv.subscribe(() => {
            if (authWindow.closed)
                pollerSubscription.unsubscribe();
            else
                authWindow.postMessage('requestCredentials', '*');
        });

        return responseObserv;
    }

    private _oAuthWindowResponseFilter(data: any) {
        if(data.message == 'deliverCredentials' || data.message == 'authFailure')
            return data;
    }

    /**
     *
     * Utilities
     *
     */

    // Match user config by user config name
    private _getUserTypeByName(name: string): UserType {
        if (name == null || this._options.userTypes == null)
            return null;

        return this._options.userTypes.find(
            userType => userType.name === name
        );
    }
}
