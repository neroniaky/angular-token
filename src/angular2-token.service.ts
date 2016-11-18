import { Injectable }       from '@angular/core';
import { CanActivate }      from '@angular/router';
import {
    Http,
    Response,
    Headers,
    Request,
    RequestMethod,
    RequestOptions
} from '@angular/http';
import { ActivatedRoute, Router }   from '@angular/router';
import { Observable }       from 'rxjs/Observable';
import 'rxjs/add/operator/share';

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

        let oAuthPath: string;

        if (oAuthType == 'github') {
            oAuthPath = this._options.oAuthPaths.github
        }

        window.open(this._constructUserPath() + oAuthPath);
    }

    // Sign out request and delete storage
    signOut(): Observable<Response> {
        let observ = this.delete(this._constructUserPath() + this._options.signOutPath);

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
    get(path: string): Observable<Response> {
        return this.sendHttpRequest(new RequestOptions({
            method: RequestMethod.Get,
            url:    this._constructApiPath() + path
        }));
    }

    post(path: string, data: any): Observable<Response> {
        return this.sendHttpRequest(new RequestOptions({
            method: RequestMethod.Post,
            url:    this._constructApiPath() + path,
            body:   data
        }));
    }

    put(path: string, data: any): Observable<Response> {
        return this.sendHttpRequest(new RequestOptions({
            method: RequestMethod.Put,
            url:    this._constructApiPath() + path,
            body:   data
        }));
    }

    delete(path: string): Observable<Response> {
        return this.sendHttpRequest(new RequestOptions({
            method: RequestMethod.Delete,
            url:    this._constructApiPath() + path
        }));
    }

    patch(path: string, data: any): Observable<Response> {
        return this.sendHttpRequest(new RequestOptions({
            method: RequestMethod.Patch,
            url:    this._constructApiPath() + path,
            body:   data
        }));
    }

    head(path: string): Observable<Response> {
        return this.sendHttpRequest(new RequestOptions({
            method: RequestMethod.Head,
            url:    this._constructApiPath() + path
        }));
    }

    options(path: string): Observable<Response> {
        return this.sendHttpRequest(new RequestOptions({
            method: RequestMethod.Options,
            url:    this._constructApiPath() + path
        }));
    }

    // Construct and send Http request
    sendHttpRequest(requestOptions: RequestOptions): Observable<Response> {

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
        baseRequestOptions = baseRequestOptions.merge(requestOptions);

        let response = this._http.request(new Request(baseRequestOptions)).share();

        this._handleResponse(response);

        return response;
    }

    // Check if response is complete and newer, then update storage
    private _handleResponse(response: Observable<Response>) {
        response.subscribe(res => {
            this._parseAuthHeadersFromResponse(<any>res);
        }, error => {
            this._parseAuthHeadersFromResponse(<any>error);
            console.log('Session Service: Error Fetching Response');
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

        let authData: AuthData = {
            accessToken:    localStorage.getItem('accessToken'),
            client:         localStorage.getItem('client'),
            expiry:         localStorage.getItem('expiry'),
            tokenType:      localStorage.getItem('tokenType'),
            uid:            localStorage.getItem('uid')
        };

        if (this._checkIfComplete(authData))
            this._currentAuthData = authData;
    }

    // Try to get auth data from url parameters.
    private _getAuthDataFromParams() {
        if(this._activatedRoute.queryParams) // Fix for Testing, needs to be removed later
            this._activatedRoute.queryParams.subscribe(queryParams => {
                let authData: AuthData = {
                    accessToken:    queryParams['token'],
                    client:         queryParams['client_id'],
                    expiry:         queryParams['expiry'],
                    tokenType:      'Bearer',
                    uid:            queryParams['uid']
                };

                if (this._checkIfComplete(authData))
                    this._currentAuthData = authData;
            });
    }

    // Write auth data to storage
    private _setAuthData(authData: AuthData) {

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
    }

    // Check if auth data complete
    private _checkIfComplete(authData: AuthData): boolean {
        if (
            authData.accessToken != null &&
            authData.client != null &&
            authData.expiry != null &&
            authData.tokenType != null &&
            authData.uid != null
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
}
