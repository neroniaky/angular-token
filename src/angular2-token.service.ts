import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
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

    constructor(private _http: Http) { }

    // Inital configuration
    init(options?: Angular2TokenOptions) {

        let defaultOptions: Angular2TokenOptions = {
            apiPath: '/',
            signInPath: 'auth/sign_in',
            signOutPath: 'auth/sign_out',
            validateTokenPath: 'auth/validate_token',
            updatePasswordPath: 'auth/password',
            userTypes: [
                { name: 'USER', path: 'users' }
            ]
        };

        this._options = Object.assign(defaultOptions, options);

        this._tryLoadAuthData();
    }

    // Log in request and set storage
    logIn(email: string, password: string, userType?: string): Observable<Response> {

        if (userType == null)
            this._currentUserType = this._options.userTypes[0];
        else
            this._currentUserType = this._getUserTypeByName(userType);

        let body = JSON.stringify({
            email: email,
            password: password
        });

        return this.post(this._currentUserType.path + '/' + this._options.signInPath, body).map(res => res.json());
    }

    // Log out request and delete storage
    logOut(): Observable<Response> {
        let logout = this.delete(this._currentUserType.path + '/' + this._options.signOutPath).map(res => res.json());

        localStorage.clear();
        this._currentAuthData = null;
        this._currentUserType = null;

        return logout;
    }

    // Validate token request
    validateToken(): Observable<Response> {
        return this.get(this._currentUserType.path + '/' + this._options.validateTokenPath).map(res => res.json());
    }

    // Update password request
    updatePassword(currentPassword: string, password: string, passwordConfirmation: string): Observable<Response> {

        let body = JSON.stringify({
            current_password: currentPassword,
            password: password,
            password_confirmation: passwordConfirmation
        });

        return this.put(this._currentUserType.path + this._options.updatePasswordPath, body).map(res => res.json());
    }

    // Standard HTTP requests
    get(path: string): Observable<Response> {
        let response = this._http.get(this._options.apiPath + path, this._constructRequestOptions()).share();
        this._handleResponse(response);
        return response;
    }

    post(path: string, data: any): Observable<Response> {
        let response = this._http.post(this._options.apiPath + path, data, this._constructRequestOptions()).share();
        this._handleResponse(response);
        return response;
    }

    put(path: string, data: any): Observable<Response> {
        let response = this._http.put(this._options.apiPath + path, data, this._constructRequestOptions()).share();
        this._handleResponse(response);
        return response;
    }

    delete(path: string): Observable<Response> {
        let response = this._http.delete(this._options.apiPath + path, this._constructRequestOptions()).share();
        this._handleResponse(response);
        return response;
    }

    patch(path: string, data: any): Observable<Response> {
        let response = this._http.patch(this._options.apiPath + path, data, this._constructRequestOptions()).share();
        this._handleResponse(response);
        return response;
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

            if (this._checkIfComplete(authData) && this._checkIfNewer(authData))
                this._setAuthData(authData);

        }, error => {
            console.log('Session Service: Error Fetching Response');
        });
    }

    // Construct options for Anfular HTTP Service request
    private _constructRequestOptions(): RequestOptions {

        let headers;

        if (this._currentAuthData == null) {
            headers = new Headers({
                'Content-Type': 'application/json'
            });
        } else {
            headers = new Headers({
                'Content-Type': 'application/json',
                'access-token': this._currentAuthData.accessToken,
                'client': this._currentAuthData.client,
                'expiry': this._currentAuthData.expiry,
                'tokenType': this._currentAuthData.tokenType,
                'uid': this._currentAuthData.uid
            });
        }

        return new RequestOptions({ headers: headers });
    }

    // Try to get auth data from storage. Return null if parameter is missing.
    private _getAuthData() {

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


    // Write auth data to storage
    private _setAuthData(authData: AuthData) {

        this._currentAuthData = authData;

        localStorage.setItem('accessToken', authData.accessToken);
        localStorage.setItem('client', authData.client);
        localStorage.setItem('expiry', authData.expiry);
        localStorage.setItem('tokenType', authData.tokenType);
        localStorage.setItem('uid', authData.uid);

        localStorage.setItem('userType', this._currentUserType.name);
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
        this._getAuthData();

        if (userType != null)
            this._currentUserType = userType;
    }

    // Match user config by user config name
    private _getUserTypeByName(name: string): UserType {
        return this._options.userTypes.find(
            userType => userType.name === name
        );
    }
}
