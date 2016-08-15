import { Injectable } from '@angular/core';
import { Http, Response, Headers, Request, RequestMethod } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';

import {
    UserType,
    AuthData,
    Angular2TokenOptions
} from './';

@Injectable()
export class Angular2TokenService {

    get currentUser(): string {
        if (this._currentUserType != null)
            return this._currentUserType.name;
        else
            return null;
    }

    private _options: Angular2TokenOptions;
    private _currentUserType: UserType;
    private _currentAuthData: AuthData;

    constructor(
        private _http: Http,
        private _router: Router
    ) { }

    // Inital configuration
    init(options?: Angular2TokenOptions) {

        let defaultOptions: Angular2TokenOptions = {
            apiPath:                    null,
            signInPath:                 'auth/sign_in',
            signOutPath:                'auth/sign_out',
            validateTokenPath:          'auth/validate_token',

            registerAccountPath:        'auth',
            deleteAccountPath:          'auth',
            registerAccountCallback:    window.location.href,

            updatePasswordPath:         'auth/password',

            resetPasswordPath:          'auth/password',
            resetPasswordCallback:      window.location.href,

            userTypes:                  null
        };

        this._options = Object.assign(defaultOptions, options);

        this._tryLoadAuthData();
    }

    // Register request
    registerAccount(email: string, password: string, passwordConfirmation: string, userType?: string): Observable<Response> {

        if (userType == null)
            this._currentUserType = null;
        else
            this._currentUserType = this._getUserTypeByName(userType);

        let body = JSON.stringify({
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
            confirm_success_url: this._options.registerAccountCallback
        });

        return this.post(this._constructUserPath() + this._options.registerAccountPath, body).map(res => res.json());
    }

    // Delete Account
    deleteAccount(): Observable<Response> {
        return this.delete(this._constructUserPath() + this._options.deleteAccountPath).map(res => res.json());
    }

    // Sign in request and set storage
    signIn(email: string, password: string, userType?: string): Observable<Response> {

        if (userType == null)
            this._currentUserType = null;
        else
            this._currentUserType = this._getUserTypeByName(userType);

        let body = JSON.stringify({
            email: email,
            password: password
        });

        return this.post(this._constructUserPath() + this._options.signInPath, body).map(res => res.json());
    }

    // Sign out request and delete storage
    signOut(): Observable<Response> {
        let response = this.delete(this._constructUserPath() + this._options.signOutPath).map(res => res.json());

        localStorage.clear();
        this._currentAuthData = null;
        this._currentUserType = null;

        return response;
    }

    // Validate token request
    validateToken(): Observable<Response> {
        return this.get(this._constructUserPath() + this._options.validateTokenPath).map(res => res.json());
    }

    // Update password request
    updatePassword(password: string, passwordConfirmation: string, currentPassword?: string, userType?: string): Observable<Response> {

        if (userType != null)
            this._currentUserType = this._getUserTypeByName(userType);

        let body: string;

        if (currentPassword == null) {
            body = JSON.stringify({
                password: password,
                password_confirmation: passwordConfirmation
            });
        } else {
            body = JSON.stringify({
                current_password: currentPassword,
                password: password,
                password_confirmation: passwordConfirmation
            });
        }

        return this.put(this._constructUserPath() + this._options.updatePasswordPath, body).map(res => res.json());
    }

    // Reset password request
    resetPassword(email: string, userType?: string): Observable<Response> {

        if (userType == null)
            this._currentUserType = null;
        else
            this._currentUserType = this._getUserTypeByName(userType);

        let body = JSON.stringify({
            email: email,
            redirect_url: this._options.resetPasswordCallback
        });

        return this.post(this._constructUserPath() + this._options.resetPasswordPath, body).map(res => res.json());
    }

    // Standard HTTP requests
    get(path: string, data?: any): Observable<Response> {
        return this._sendHttpRequest(RequestMethod.Get, path, data);
    }

    post(path: string, data: any): Observable<Response> {
        return this._sendHttpRequest(RequestMethod.Post, path, data);
    }

    put(path: string, data: any): Observable<Response> {
        return this._sendHttpRequest(RequestMethod.Put, path, data);
    }

    delete(path: string, data?: any): Observable<Response> {
        return this._sendHttpRequest(RequestMethod.Delete, path, data);
    }

    patch(path: string, data: any): Observable<Response> {
        return this._sendHttpRequest(RequestMethod.Patch, path, data);
    }

    // Check if response is complete and newer, then update storage
    private _handleResponse(response: Observable<Response>) {

        response.subscribe(res => {

            let headers = res.headers;

            let authData: AuthData = {
                accessToken: headers.get('access-token'),
                client: headers.get('client'),
                expiry: headers.get('expiry'),
                tokenType: headers.get('token-type'),
                uid: headers.get('uid')
            };

            this._setAuthData(authData);

        }, error => {
            console.log('Session Service: Error Fetching Response');
        });
    }

    // Construct and send Http request
    private _sendHttpRequest(method: RequestMethod, path: string, body?: any): Observable<Response> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let respBody = "";

        if (this._currentAuthData != null) {
            headers = new Headers({
                'Content-Type': 'application/json',
                'access-token': this._currentAuthData.accessToken,
                'client': this._currentAuthData.client,
                'expiry': this._currentAuthData.expiry,
                'token-type': this._currentAuthData.tokenType,
                'uid': this._currentAuthData.uid
            });
        }

        if (body != null)
            respBody = body;

        let response = this._http.request(new Request({
            method: method,
            url: this._constructApiPath() + path,
            headers: headers,
            body: respBody
        })).share();

        this._handleResponse(response);

        return response;
    }

    // Try to get auth data from storage. Return null if parameter is missing.
    private _getAuthDataFromStorage() {

        let authData: AuthData = {
            accessToken: localStorage.getItem('accessToken'),
            client: localStorage.getItem('client'),
            expiry: localStorage.getItem('expiry'),
            tokenType: localStorage.getItem('tokenType'),
            uid: localStorage.getItem('uid')
        };

        if (this._checkIfComplete(authData))
            this._currentAuthData = authData;
        else
            this._currentAuthData = null;
    }

    // Try to get auth data from url parameters. Return null if parameter is missing.
    private _getAuthDataFromParams() {

        if (this._router.routerState != null) { // Fix for Testing, has to be removed later
            this._router.routerState.queryParams.subscribe(params => {

                let authData: AuthData = {
                    accessToken: params['token'],
                    client: params['client_id'],
                    expiry: params['expiry'],
                    tokenType: 'Bearer',
                    uid: params['uid']
                };

                if (this._checkIfComplete(authData))
                    this._currentAuthData = authData;
                else
                    this._currentAuthData = null;
            });
        }
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
        this._getAuthDataFromStorage();
        this._getAuthDataFromParams();

        if (userType != null)
            this._currentUserType = userType;
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
