import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, CanActivate } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
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
        if (this.atCurrentUserType != null)
            return this.atCurrentUserType.name;
        else
            return null;
    }

    get currentUserData(): UserData {
        return this.atCurrentUserData;
    }

    get currentAuthData(): AuthData {
        return this.atCurrentAuthData;
    }

    get currentAuthHeaders(): Headers {
        if (this.atCurrentAuthData != null) {
            return new Headers({
                'access-token': this.atCurrentAuthData.accessToken,
                'client':       this.atCurrentAuthData.client,
                'expiry':       this.atCurrentAuthData.expiry,
                'token-type':   this.atCurrentAuthData.tokenType,
                'uid':          this.atCurrentAuthData.uid
            });
        }

        return new Headers;
    }

    private atOptions: Angular2TokenOptions;
    private atCurrentUserType: UserType;
    private atCurrentAuthData: AuthData;
    private atCurrentUserData: UserData;

    constructor(
        private http: Http,
        @Optional() private activatedRoute: ActivatedRoute,
        @Optional() private router: Router,
        @Inject(PLATFORM_ID) protected platformId: Object
    ) { }

    userSignedIn(): boolean {
        return !!this.atCurrentAuthData;
    }

    canActivate(): boolean {
        if (this.userSignedIn())
            return true;
        else {
            // Store current location in storage (usefull for redirection after signing in)
            if (this.atOptions.signInStoredUrlStorageKey && isPlatformBrowser(this.platformId)) {
                localStorage.setItem(
                    this.atOptions.signInStoredUrlStorageKey,
                    window.location.pathname + window.location.search
                );
            }

            // Redirect user to sign in if signInRedirect is set
            if(this.router && this.atOptions.signInRedirect)
                this.router.navigate([this.atOptions.signInRedirect]);

            return false;
        }
    }

    // Inital configuration
    init(options?: Angular2TokenOptions) {

        let defaultOptions: Angular2TokenOptions = {
            apiPath:                    null,
            apiBase:                    null,
            hostUrl:                    null,

            signInPath:                 'auth/sign_in',
            signInRedirect:             null,
            signInStoredUrlStorageKey:  null,

            signOutPath:                'auth/sign_out',
            validateTokenPath:          'auth/validate_token',
            signOutFailedValidate:      false,

            registerAccountPath:        'auth',
            deleteAccountPath:          'auth',
            registerAccountCallback:    isPlatformBrowser(this.platformId) ? window.location.href : null,

            updatePasswordPath:         'auth',

            resetPasswordPath:          'auth/password',
            resetPasswordCallback:      isPlatformBrowser(this.platformId) ? window.location.href : null,

            userTypes:                  null,

            oAuthBase:                  isPlatformBrowser(this.platformId) ? window.location.origin : null,
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

        this.atOptions = (<any>Object).assign(defaultOptions, options);

        this.tryLoadAuthData();
    }

    /**
     *
     * Actions
     *
     */

    // Register request
    registerAccount(registerData: RegisterData): Observable<Response> {

        if (registerData.userType == null)
            this.atCurrentUserType = null;
        else {
            this.atCurrentUserType = this.getUserTypeByName(registerData.userType);
            delete registerData.userType;
        }

        registerData.password_confirmation  = registerData.passwordConfirmation;
        delete registerData.passwordConfirmation;

        registerData.confirm_success_url    = this.atOptions.registerAccountCallback;

        return this.post(this.getUserPath() + this.atOptions.registerAccountPath, JSON.stringify(registerData));
    }

    // Delete Account
    deleteAccount(): Observable<Response> {
        return this.delete(this.getUserPath() + this.atOptions.deleteAccountPath);
    }

    // Sign in request and set storage
    signIn(signInData: SignInData): Observable<Response> {

        if (signInData.userType == null)
            this.atCurrentUserType = null;
        else
            this.atCurrentUserType = this.getUserTypeByName(signInData.userType);

        let body = JSON.stringify({
            email:      signInData.email,
            password:   signInData.password
        });

        let observ = this.post(this.getUserPath() + this.atOptions.signInPath, body);

        observ.subscribe(res => this.atCurrentUserData = res.json().data, _error => null);

        return observ;
    }

    signInOAuth(oAuthType: string) {

        let oAuthPath: string = this.getOAuthPath(oAuthType);
        let callbackUrl: string = `${window.location.origin}/${this.atOptions.oAuthCallbackPath}`;
        let oAuthWindowType: string = this.atOptions.oAuthWindowType;
        let authUrl: string = this.getOAuthUrl(oAuthPath, callbackUrl, oAuthWindowType);

        if (oAuthWindowType == 'newWindow') {
            let oAuthWindowOptions = this.atOptions.oAuthWindowOptions;
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
            return this.requestCredentialsViaPostMessage(popup);
        } else if (oAuthWindowType == 'sameWindow') {
            window.location.href = authUrl;
        } else {
            throw `Unsupported oAuthWindowType "${oAuthWindowType}"`;
        }
    }

    processOAuthCallback(): void {
        this.getAuthDataFromParams();
    }

    // Sign out request and delete storage
    signOut(): Observable<Response> {
        let observ = this.delete(this.getUserPath() + this.atOptions.signOutPath);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('client');
        localStorage.removeItem('expiry');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('uid');

        this.atCurrentAuthData = null;
        this.atCurrentUserType = null;
        this.atCurrentUserData = null;

        return observ;
    }

    // Validate token request
    validateToken(): Observable<Response> {
        let observ = this.get(this.getUserPath() + this.atOptions.validateTokenPath);

        observ.subscribe(
            res => this.atCurrentUserData = res.json().data,
            error => {
                if (error.status === 401 && this.atOptions.signOutFailedValidate) {
                    this.signOut();
                }
            });

        return observ;
    }

    // Update password request
    updatePassword(updatePasswordData: UpdatePasswordData): Observable<Response> {

        if (updatePasswordData.userType != null)
            this.atCurrentUserType = this.getUserTypeByName(updatePasswordData.userType);

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
        return this.put(this.getUserPath() + this.atOptions.updatePasswordPath, body);
    }

    // Reset password request
    resetPassword(resetPasswordData: ResetPasswordData): Observable<Response> {

        if (resetPasswordData.userType == null)
            this.atCurrentUserType = null;
        else
            this.atCurrentUserType = this.getUserTypeByName(resetPasswordData.userType);

        let body = JSON.stringify({
            email:          resetPasswordData.email,
            redirect_url:   this.atOptions.resetPasswordCallback
        });

        return this.post(this.getUserPath() + this.atOptions.resetPasswordPath, body);
    }

    /**
     *
     * HTTP Wrappers
     *
     */

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this.mergeRequestOptionsArgs({
            url:    this.getApiPath() + url,
            method: RequestMethod.Get
        }, options));
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this.mergeRequestOptionsArgs({
            url:    this.getApiPath() + url,
            method: RequestMethod.Post,
            body:   body
        }, options));
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this.mergeRequestOptionsArgs({
            url:    this.getApiPath() + url,
            method: RequestMethod.Put,
            body:   body
        }, options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this.mergeRequestOptionsArgs({
            url:    this.getApiPath() + url,
            method: RequestMethod.Delete
        }, options));
    }

    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this.mergeRequestOptionsArgs({
            url:    this.getApiPath() + url,
            method: RequestMethod.Patch,
            body:   body
        }, options));
    }

    head(path: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.request({
            method: RequestMethod.Head,
            url:    this.getApiPath() + path
        });
    }

    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this.mergeRequestOptionsArgs({
            url:    this.getApiPath() + url,
            method: RequestMethod.Options
        }, options));
    }

    // Construct and send Http request
    request(options: RequestOptionsArgs): Observable<Response> {

        let baseRequestOptions: RequestOptions;
        let baseHeaders:        { [key:string]: string; } = this.atOptions.globalOptions.headers;

        // Get auth data from local storage
        this.getAuthDataFromStorage();

        // Merge auth headers to request if set
        if (this.atCurrentAuthData != null) {
            (<any>Object).assign(baseHeaders, {
                'access-token': this.atCurrentAuthData.accessToken,
                'client':       this.atCurrentAuthData.client,
                'expiry':       this.atCurrentAuthData.expiry,
                'token-type':   this.atCurrentAuthData.tokenType,
                'uid':          this.atCurrentAuthData.uid
            });
        }

        baseRequestOptions = new RequestOptions({
            headers: new Headers(baseHeaders)
        });

        // Merge standard and custom RequestOptions
        baseRequestOptions = baseRequestOptions.merge(options);

        let response = this.http.request(new Request(baseRequestOptions)).share();
        this.handleResponse(response);

        return response;
    }

    private mergeRequestOptionsArgs(options: RequestOptionsArgs, addOptions?: RequestOptionsArgs): RequestOptionsArgs {

        let returnOptions: RequestOptionsArgs = options;

        if (options)
            (<any>Object).assign(returnOptions, addOptions);

        return returnOptions;
    }

    // Check if response is complete and newer, then update storage
    private handleResponse(response: Observable<Response>): void {
        response.subscribe(res => {
            this.getAuthHeadersFromResponse(<any>res);
        }, error => {
            this.getAuthHeadersFromResponse(<any>error);
        });
    }

    /**
     *
     * Get Auth Data
     *
     */

    // Try to load auth data
    private tryLoadAuthData(): void {

        let userType = this.getUserTypeByName(localStorage.getItem('userType'));

        if (userType)
            this.atCurrentUserType = userType;

        this.getAuthDataFromStorage();

        if(this.activatedRoute)
            this.getAuthDataFromParams();

        if (this.atCurrentAuthData)
            this.validateToken();
    }

    // Parse Auth data from response
    private getAuthHeadersFromResponse(data: any): void {
        let headers = data.headers;

        let authData: AuthData = {
            accessToken:    headers.get('access-token'),
            client:         headers.get('client'),
            expiry:         headers.get('expiry'),
            tokenType:      headers.get('token-type'),
            uid:            headers.get('uid')
        };

        this.setAuthData(authData);
    }

    // Parse Auth data from post message
    private getAuthDataFromPostMessage(data: any): void {
        let authData: AuthData = {
            accessToken:    data['auth_token'],
            client:         data['client_id'],
            expiry:         data['expiry'],
            tokenType:      'Bearer',
            uid:            data['uid']
        };

        this.setAuthData(authData);
    }

    // Try to get auth data from storage.
    private getAuthDataFromStorage(): void {

        let authData: AuthData = {
            accessToken:    localStorage.getItem('accessToken'),
            client:         localStorage.getItem('client'),
            expiry:         localStorage.getItem('expiry'),
            tokenType:      localStorage.getItem('tokenType'),
            uid:            localStorage.getItem('uid')
        };

        if (this.checkAuthData(authData))
            this.atCurrentAuthData = authData;
    }

    // Try to get auth data from url parameters.
    private getAuthDataFromParams(): void {
        if(this.activatedRoute.queryParams) // Fix for Testing, needs to be removed later
            this.activatedRoute.queryParams.subscribe(queryParams => {
                let authData: AuthData = {
                    accessToken:    queryParams['token'] || queryParams['auth_token'],
                    client:         queryParams['client_id'],
                    expiry:         queryParams['expiry'],
                    tokenType:      'Bearer',
                    uid:            queryParams['uid']
                };

                if (this.checkAuthData(authData))
                    this.atCurrentAuthData = authData;
            });
    }

    /**
     *
     * Set Auth Data
     *
     */

    // Write auth data to storage
    private setAuthData(authData: AuthData): void {

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
    }

    /**
     *
     * Validate Auth Data
     *
     */

    // Check if auth data complete and if response token is newer
    private checkAuthData(authData: AuthData): boolean {

        if (
            authData.accessToken != null &&
            authData.client != null &&
            authData.expiry != null &&
            authData.tokenType != null &&
            authData.uid != null
        ) {
            if (this.atCurrentAuthData != null)
                return authData.expiry >= this.atCurrentAuthData.expiry;
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

    private getUserPath(): string {
        if (this.atCurrentUserType == null)
            return '';
        else
            return this.atCurrentUserType.path + '/';
    }

    private getApiPath(): string {
        let constructedPath = '';

        if (this.atOptions.apiBase != null)
            constructedPath += this.atOptions.apiBase + '/';

        if (this.atOptions.apiPath != null)
            constructedPath += this.atOptions.apiPath + '/';

        return constructedPath;
    }

    private getOAuthPath(oAuthType: string): string {
        let oAuthPath: string;

        oAuthPath = this.atOptions.oAuthPaths[oAuthType];

        if (oAuthPath == null)
            oAuthPath = `/auth/${oAuthType}`;

        return oAuthPath;
    }

    private getOAuthUrl(oAuthPath: string, callbackUrl: string, windowType: string): string {
        let url: string;

        url =   `${this.atOptions.oAuthBase}/${oAuthPath}`;
        url +=  `?omniauth_window_type=${windowType}`;
        url +=  `&auth_origin_url=${encodeURIComponent(callbackUrl)}`;

        if (this.atCurrentUserType != null)
            url += `&resource_class=${this.atCurrentUserType.name}`;

        return url;
    }

    /**
     *
     * OAuth
     *
     */

    private requestCredentialsViaPostMessage(authWindow: any): Observable<any> {
        let pollerObserv = Observable.interval(500);

        let responseObserv = Observable.fromEvent(window, 'message').pluck('data')
            .filter(this.oAuthWindowResponseFilter);

        let responseSubscription = responseObserv.subscribe(
            this.getAuthDataFromPostMessage.bind(this)
        );

        let pollerSubscription = pollerObserv.subscribe(() => {
            if (authWindow.closed)
                pollerSubscription.unsubscribe();
            else
                authWindow.postMessage('requestCredentials', '*');
        });

        return responseObserv;
    }

    private oAuthWindowResponseFilter(data: any): any {
        if(data.message == 'deliverCredentials' || data.message == 'authFailure')
            return data;
    }

    /**
     *
     * Utilities
     *
     */

    // Match user config by user config name
    private getUserTypeByName(name: string): UserType {
        if (name == null || this.atOptions.userTypes == null)
            return null;

        return this.atOptions.userTypes.find(
            userType => userType.name === name
        );
    }
}
