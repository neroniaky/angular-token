import { Injectable }       from '@angular/core';
import { CanActivate }      from '@angular/router';
import {
    Http,
    Response,
    Headers,
    Request,
    RequestMethod,
    RequestOptions,
    RequestOptionsArgs
} from '@angular/http';
import { ActivatedRoute, Router }   from '@angular/router';
import { Observable }       from 'rxjs/Observable';
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

    private _options: Angular2TokenOptions;
    private _currentUserType: UserType;
    private _currentAuthData: AuthData;
    private _currentUserData: UserData;

    constructor(
        private _http: Http,
        private _activatedRoute: ActivatedRoute,
        private _router: Router
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
            if(this._options.signInRedirect)
                this._router.navigate([this._options.signInRedirect]);
            
            return false;
        }         
    }

    // Inital configuration
    init(options?: Angular2TokenOptions) {

        let defaultOptions: Angular2TokenOptions = {
            apiPath:                    null,

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

            oAuthPaths: {
                github:                 'auth/github'
            },
            oAuthCallbackPath:          'oauth_callback',
            oAuthWindowType:            'newWindow',
            globalOptions: {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept':       'application/json'
                }
            },
            storageKey: null
        };

        this._options = (<any>Object).assign(defaultOptions, options);

        this._tryLoadAuthData();
    }

    // Register request
    registerAccount(registerData: RegisterData): Observable<Response> {

        if (registerData.userType == null)
            this._currentUserType = null;
        else
            this._currentUserType = this._getUserTypeByName(registerData.userType);

        let body = JSON.stringify({
            email:                  registerData.email,
            password:               registerData.password,
            password_confirmation:  registerData.passwordConfirmation,
            confirm_success_url:    this._options.registerAccountCallback
        });

        return this.post(this._constructUserPath() + this._options.registerAccountPath, body);
    }

    // Delete Account
    deleteAccount(): Observable<Response> {
        return this.delete(this._constructUserPath() + this._options.deleteAccountPath);
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

        let observ = this.post(this._constructUserPath() + this._options.signInPath, body);

        observ.subscribe(res => this._currentUserData = res.json().data, error => null);

        return observ;
    }

    signInOAuth(oAuthType: string) {

        let oAuthPath: string = this._getOAuthPath(oAuthType);
        let callbackUrl: string = `${window.location.origin}/${this._options.oAuthCallbackPath}`;
        let oAuthWindowType: string = this._options.oAuthWindowType;
        let authUrl: string = this._buildOAuthUrl(oAuthPath, callbackUrl, oAuthWindowType);

        if (oAuthWindowType == 'newWindow') {
            let popup = window.open(authUrl, '_blank', 'closebuttoncaption=Cancel');
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

    cleanup() {
        if (this._options.storageKey) {
          localStorage.removeItem(this._options.storageKey);
        } else {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('client');
          localStorage.removeItem('expiry');
          localStorage.removeItem('tokenType');
          localStorage.removeItem('uid');
        }

        this._currentAuthData = null;
        this._currentUserType = null;
        this._currentUserData = null;
    }

    // Sign out request and delete storage
    signOut(): Observable<Response> {
        let observ = this.delete(this._constructUserPath() + this._options.signOutPath);

        this.cleanup();

        return observ;
    }

    // Validate token request
    validateToken(): Observable<Response> {
        let observ = this.get(this._constructUserPath() + this._options.validateTokenPath);

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

        let body: string;

        if (updatePasswordData.passwordCurrent == null) {
            body = JSON.stringify({
                password:               updatePasswordData.password,
                password_confirmation:  updatePasswordData.passwordConfirmation
            });
        } else {
            body = JSON.stringify({
                current_password:       updatePasswordData.passwordCurrent,
                password:               updatePasswordData.password,
                password_confirmation:  updatePasswordData.passwordConfirmation
            });
        }

        return this.put(this._constructUserPath() + this._options.updatePasswordPath, body);
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

        return this.post(this._constructUserPath() + this._options.resetPasswordPath, body);
    }

    // Standard HTTP requests
    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this._mergeRequestOptionsArgs({
            url:    this._constructApiPath() + url,
            method: RequestMethod.Get
        }, options));
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this._mergeRequestOptionsArgs({
            url:    this._constructApiPath() + url,
            method: RequestMethod.Post,
            body:   body
        }, options));
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this._mergeRequestOptionsArgs({
            url:    this._constructApiPath() + url,
            method: RequestMethod.Put,
            body:   body
        }, options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this._mergeRequestOptionsArgs({
            url:    this._constructApiPath() + url,
            method: RequestMethod.Delete
        }, options));
    }

    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this._mergeRequestOptionsArgs({
            url:    this._constructApiPath() + url,
            method: RequestMethod.Patch,
            body:   body
        }, options));
    }

    head(path: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.request({
            method: RequestMethod.Head,
            url:    this._constructApiPath() + path
        });
    }

    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.request(this._mergeRequestOptionsArgs({
            url:    this._constructApiPath() + url,
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
            this._parseAuthHeadersFromResponse(<any>res);
        }, error => {
            this._parseAuthHeadersFromResponse(<any>error);
        });
    }

    private _parseAuthHeadersFromResponse(data: any){
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

    // Try to get auth data from storage.
    private _getAuthDataFromStorage() {
        let authData: AuthData;

        if (this._options.storageKey) {
           authData = JSON.parse(
             localStorage.getItem(this._options.storageKey) || '{}'
           );
        } else {
           authData = {
            accessToken:    localStorage.getItem('accessToken'),
            client:         localStorage.getItem('client'),
            expiry:         localStorage.getItem('expiry'),
            tokenType:      localStorage.getItem('tokenType'),
            uid:            localStorage.getItem('uid')
          };
        }

        if (this._checkIfComplete(authData))
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

                if (this._checkIfComplete(authData))
                    this._currentAuthData = authData;
            });
    }

    private _parseAuthDataFromPostMessage(data: any){
        let authData: AuthData = {
            accessToken:    data['auth_token'],
            client:         data['client_id'],
            expiry:         data['expiry'],
            tokenType:      'Bearer',
            uid:            data['uid']
        };

        this._setAuthData(authData);
    }

    // Write auth data to storage
    private _setAuthData(authData: AuthData) {

        if (this._checkIfComplete(authData) && this._checkIfNewer(authData)) {

            this._currentAuthData = authData;

            if (this._options.storageKey) {
              localStorage.setItem(
                this._options.storageKey, JSON.stringify(authData)
              );
            } else {
              localStorage.setItem('accessToken', authData.accessToken);
              localStorage.setItem('client', authData.client);
              localStorage.setItem('expiry', authData.expiry);
              localStorage.setItem('tokenType', authData.tokenType);
              localStorage.setItem('uid', authData.uid);
            }

            if (this._currentUserType != null)
                localStorage.setItem('userType', this._currentUserType.name);

        }
    }

    // Check if auth data complete
    private _checkIfComplete(authData: AuthData): boolean {
        if (
            authData.accessToken != null && authData.accessToken != undefined &&
            authData.client != null  && authData.client != undefined &&
            authData.expiry != null  && authData.expiry != undefined &&
            authData.tokenType != null  && authData.tokenType != undefined &&
            authData.uid != null  && authData.uid != undefined
        ) {
            return true;
        } else {
            return false;
        }
    }

    // Check if response token is newer
    private _checkIfNewer(authData: AuthData): boolean {
        if (this._currentAuthData != null)
            return authData.expiry >= this._currentAuthData.expiry;
        else
            return true;
    }

    // Try to load user config from storage
    private _tryLoadAuthData() {

        let userType = this._getUserTypeByName(localStorage.getItem('userType'));
        if (userType)
            this._currentUserType = userType;

        this._getAuthDataFromStorage();
        this._getAuthDataFromParams();

        if (this._currentAuthData != null)
            this.validateToken();
    }

    // Match user config by user config name
    private _getUserTypeByName(name: string): UserType {
        if (name == null || this._options.userTypes == null)
            return null;

        return this._options.userTypes.find(
            userType => userType.name === name
        );
    }

    private _constructUserPath(): string {
        if (this._currentUserType == null)
            return '';
        else
            return this._currentUserType.path + '/';
    }

    private _constructApiPath(): string {
        if (this._options.apiPath == null)
            return '';
        else
            return this._options.apiPath + '/';
    }

    private _getOAuthPath(oAuthType: string): string {
        let oAuthPath: string;

        oAuthPath = this._options.oAuthPaths[oAuthType];
        if (oAuthPath == null) {
            oAuthPath = `/auth/${oAuthType}`;
        }
        return oAuthPath;
    }

    private _buildOAuthUrl(oAuthPath: string, callbackUrl: string, windowType: string): string {
        let url: string;

        url = `${window.location.origin}/${oAuthPath}`;
        url += `?omniauth_window_type=${windowType}`;
        url += `&auth_origin_url=${encodeURIComponent(callbackUrl)}`;
        if (this._currentUserType != null) {
            url += `&resource_class=${this._currentUserType.name}`;
        }
        return url;
    }

    private _requestCredentialsViaPostMessage(authWindow: any): Observable<any> {
        let poller_observ = Observable.interval(500);
        let response_observ = Observable.fromEvent(window, 'message')
                                        .pluck('data')
                                        .filter(this._oauthWindowResponseFilter);

        let response_subscription = response_observ.subscribe(this._parseAuthDataFromPostMessage.bind(this));
        let poller_subscription = poller_observ.subscribe(() => {
            if (authWindow.closed) {
                poller_subscription.unsubscribe();
            } else {
                authWindow.postMessage('requestCredentials', '*');
            }
        });
        return response_observ;
    }

    private _oauthWindowResponseFilter(data: any) {
        if(data.message == 'deliverCredentials' || data.message == 'authFailure') {
            return data;
        }
    }
}
