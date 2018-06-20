import { Injectable, Optional, Inject } from '@angular/core';
import { ActivatedRoute, Router, CanActivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable, fromEvent, interval } from 'rxjs';
import { pluck, filter, tap, share, finalize } from 'rxjs/operators';

import { ANGULAR_TOKEN_OPTIONS } from './angular-token.token';

import {
  SignInData,
  RegisterData,
  UpdatePasswordData,
  ResetPasswordData,

  UserType,
  UserData,
  AuthData,

  AngularTokenOptions
} from './angular-token.model';

@Injectable()
export class AngularTokenService implements CanActivate {

  get currentUserType(): string {
    if (this.atCurrentUserType != null) {
      return this.atCurrentUserType.name;
    } else {
      return null;
    }
  }

  get currentUserData(): UserData {
    return this.atCurrentUserData;
  }

  get currentAuthData(): AuthData {
    return this.atCurrentAuthData;
  }

  get baseHeaders(): any {
    return this.atOptions.globalOptions.headers;
  }

  get apiPath(): any {
    return this.atOptions.apiPath;
  }


  private atOptions: AngularTokenOptions;
  private atCurrentUserType: UserType;
  private atCurrentAuthData: AuthData;
  private atCurrentUserData: UserData;

  constructor(
    private _http: HttpClient,
    @Inject(ANGULAR_TOKEN_OPTIONS) config: any,
    @Optional() private activatedRoute: ActivatedRoute,
    @Optional() private router: Router
  ) {
    const defaultOptions: AngularTokenOptions = {
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
      loginField:                 'email',

      oAuthBase:                  window.location.origin,
      oAuthPaths: {
        github:                   'auth/github'
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

    const mergedOptions = (<any>Object).assign(defaultOptions, config);
    this.atOptions = mergedOptions;

    this.tryLoadAuthData();
  }

  userSignedIn(): boolean {
      return !!this.atCurrentAuthData;
  }

  canActivate(): boolean {
    if (this.userSignedIn()) {
      return true;
    } else {
      // Store current location in storage (usefull for redirection after signing in)
      if (this.atOptions.signInStoredUrlStorageKey) {
        localStorage.setItem(
          this.atOptions.signInStoredUrlStorageKey,
          window.location.pathname + window.location.search
        );
      }

      // Redirect user to sign in if signInRedirect is set
      if (this.router && this.atOptions.signInRedirect) {
        this.router.navigate([this.atOptions.signInRedirect]);
      }

      return false;
    }
  }


  /**
   *
   * Actions
   *
   */

  // Register request
  registerAccount(registerData: RegisterData): Observable<any> {

    if (registerData.userType == null) {
      this.atCurrentUserType = null;
    } else {
      this.atCurrentUserType = this.getUserTypeByName(registerData.userType);
      delete registerData.userType;
    }

    if (
      registerData.password_confirmation == null &&
      registerData.passwordConfirmation != null
    ) {
      registerData.password_confirmation  = registerData.passwordConfirmation;
      delete registerData.passwordConfirmation;
    }

    registerData.confirm_success_url    = this.atOptions.registerAccountCallback;

    return this._http.post(this.getServerPath() + this.atOptions.registerAccountPath, JSON.stringify(registerData));
  }

  // Delete Account
  deleteAccount(): Observable<any> {
    return this._http.delete(this.getServerPath() + this.atOptions.deleteAccountPath);
  }

  // Sign in request and set storage
  signIn(signInData: SignInData): Observable<any> {
    this.atCurrentUserType = (signInData.userType == null) ? null : this.getUserTypeByName(signInData.userType);

    const body = JSON.stringify({
      [this.atOptions.loginField]: signInData.login,
      password: signInData.password
    });

    const observ = this._http.post(this.getServerPath() + this.atOptions.signInPath, body, { observe: 'response' }).pipe(share());

    observ.subscribe(res => this.atCurrentUserData = res.body['data'], _error => null);
    this.handleResponse(observ);

    return observ;
  }

  signInOAuth(oAuthType: string) {

    const oAuthPath: string = this.getOAuthPath(oAuthType);
    const callbackUrl = `${window.location.origin}/${this.atOptions.oAuthCallbackPath}`;
    const oAuthWindowType: string = this.atOptions.oAuthWindowType;
    const authUrl: string = this.getOAuthUrl(oAuthPath, callbackUrl, oAuthWindowType);

    if (oAuthWindowType === 'newWindow') {
      const oAuthWindowOptions = this.atOptions.oAuthWindowOptions;
      let windowOptions = '';

      if (oAuthWindowOptions) {
        for (const key in oAuthWindowOptions) {
          if (oAuthWindowOptions.hasOwnProperty(key)) {
              windowOptions += `,${key}=${oAuthWindowOptions[key]}`;
          }
        }
      }

      const popup = window.open(
          authUrl,
          '_blank',
          `closebuttoncaption=Cancel${windowOptions}`
      );
      return this.requestCredentialsViaPostMessage(popup);
    } else if (oAuthWindowType === 'sameWindow') {
      window.location.href = authUrl;
    } else {
      throw new Error(`Unsupported oAuthWindowType "${oAuthWindowType}"`);
    }
  }

  processOAuthCallback(): void {
    this.getAuthDataFromParams();
  }


  // Sign out request and delete storage
  signOut(): Observable<any> {
    const observ = this._http.delete<any>(this.getServerPath() + this.atOptions.signOutPath)
          // Only remove the localStorage and clear the data after the call
          .pipe(
            finalize(() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('client');
                localStorage.removeItem('expiry');
                localStorage.removeItem('tokenType');
                localStorage.removeItem('uid');

                this.atCurrentAuthData = null;
                this.atCurrentUserType = null;
                this.atCurrentUserData = null;
              }
            )
          );

    return observ;
  }



  // Validate token request
  validateToken(): Observable<any> {
    const observ = this._http.get(this.getServerPath() + this.atOptions.validateTokenPath);

    observ.subscribe(
      (res) => this.atCurrentUserData = res['data'],
      (error) => {
        if (error.status === 401 && this.atOptions.signOutFailedValidate) {
          this.signOut();
        }
    });

    return observ;
  }

  // Update password request
  updatePassword(updatePasswordData: UpdatePasswordData): Observable<any> {

    if (updatePasswordData.userType != null) {
      this.atCurrentUserType = this.getUserTypeByName(updatePasswordData.userType);
    }

    let args: any;

    if (updatePasswordData.passwordCurrent == null) {
      args = {
        password:               updatePasswordData.password,
        password_confirmation:  updatePasswordData.passwordConfirmation
      };
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

    const body = JSON.stringify(args);
    return this._http.put(this.getServerPath() + this.atOptions.updatePasswordPath, body);
  }

  // Reset password request
  resetPassword(resetPasswordData: ResetPasswordData): Observable<any> {

    this.atCurrentUserType = (resetPasswordData.userType == null) ? null : this.getUserTypeByName(resetPasswordData.userType);

    const body = JSON.stringify({
      [this.atOptions.loginField]: resetPasswordData.login,
      redirect_url: this.atOptions.resetPasswordCallback
    });

    return this._http.post(this.getServerPath() + this.atOptions.resetPasswordPath, body);
  }



  /**
   *
   * Construct Paths / Urls
   *
   */

  private getUserPath(): string {
    return (this.atCurrentUserType == null) ? '' : this.atCurrentUserType.path + '/';
  }

  private getApiPath(): string {
    let constructedPath = '';

    if (this.atOptions.apiBase != null) {
      constructedPath += this.atOptions.apiBase + '/';
    }

    if (this.atOptions.apiPath != null) {
      constructedPath += this.atOptions.apiPath + '/';
    }

    return constructedPath;
  }

  private getServerPath(): string {
    return this.getApiPath() + this.getUserPath();
  }

  private getOAuthPath(oAuthType: string): string {
    let oAuthPath: string;

    oAuthPath = this.atOptions.oAuthPaths[oAuthType];

    if (oAuthPath == null) {
      oAuthPath = `/auth/${oAuthType}`;
    }

    return oAuthPath;
  }

  private getOAuthUrl(oAuthPath: string, callbackUrl: string, windowType: string): string {
    let url: string;

    url =   `${this.atOptions.oAuthBase}/${oAuthPath}`;
    url +=  `?omniauth_window_type=${windowType}`;
    url +=  `&auth_origin_url=${encodeURIComponent(callbackUrl)}`;

    if (this.atCurrentUserType != null) {
      url += `&resource_class=${this.atCurrentUserType.name}`;
    }

    return url;
  }


  /**
   *
   * Get Auth Data
   *
   */

  // Try to load auth data
  private tryLoadAuthData(): void {

    const userType = this.getUserTypeByName(localStorage.getItem('userType'));

    if (userType) {
      this.atCurrentUserType = userType;
    }

    this.getAuthDataFromStorage();

    if (this.activatedRoute) {
      this.getAuthDataFromParams();
    }

    // if (this.atCurrentAuthData) {
    //     this.validateToken();
    // }
  }

  // Parse Auth data from response
  private getAuthHeadersFromResponse(data: any): void {
    const headers = data.headers;

    const authData: AuthData = {
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
    const authData: AuthData = {
      accessToken:    data['auth_token'],
      client:         data['client_id'],
      expiry:         data['expiry'],
      tokenType:      'Bearer',
      uid:            data['uid']
    };

    this.setAuthData(authData);
  }

  // Try to get auth data from storage.
  public getAuthDataFromStorage(): void {

    const authData: AuthData = {
      accessToken:    localStorage.getItem('accessToken'),
      client:         localStorage.getItem('client'),
      expiry:         localStorage.getItem('expiry'),
      tokenType:      localStorage.getItem('tokenType'),
      uid:            localStorage.getItem('uid')
    };

    if (this.checkAuthData(authData)) {
      this.atCurrentAuthData = authData;
    }
  }

  // Try to get auth data from url parameters.
  private getAuthDataFromParams(): void {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      const authData: AuthData = {
        accessToken:    queryParams['token'] || queryParams['auth_token'],
        client:         queryParams['client_id'],
        expiry:         queryParams['expiry'],
        tokenType:      'Bearer',
        uid:            queryParams['uid']
      };

      if (this.checkAuthData(authData)) {
        this.atCurrentAuthData = authData;
      }
    });
  }


  // Check if response is complete and newer, then update storage
  private handleResponse(response: Observable<any>): void {
    response.subscribe(res => {
      this.getAuthHeadersFromResponse(<any>res);
    }, error => {
      this.getAuthHeadersFromResponse(<any>error);
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

      if (this.atCurrentUserType != null) {
        localStorage.setItem('userType', this.atCurrentUserType.name);
      }

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
      if (this.atCurrentAuthData != null) {
        return authData.expiry >= this.atCurrentAuthData.expiry;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }


  /**
   *
   * OAuth
   *
   */

  private requestCredentialsViaPostMessage(authWindow: any): Observable<any> {
    const pollerObserv = interval(500);

    const responseObserv = fromEvent(window, 'message')
                            .pipe(
                                pluck('data'),
                                filter(this.oAuthWindowResponseFilter)
                            );

    const responseSubscription = responseObserv.subscribe(
      this.getAuthDataFromPostMessage.bind(this)
    );

    const pollerSubscription = pollerObserv.subscribe(() => {
      if (authWindow.closed) {
        pollerSubscription.unsubscribe();
      } else {
        authWindow.postMessage('requestCredentials', '*');
      }
    });

    return responseObserv;
  }

  private oAuthWindowResponseFilter(data: any): any {
    if (data.message === 'deliverCredentials' || data.message === 'authFailure') {
      return data;
    }
  }


  /**
   *
   * Utilities
   *
   */

  // Match user config by user config name
  private getUserTypeByName(name: string): UserType {
    if (name == null || this.atOptions.userTypes == null) {
      return null;
    }

    return this.atOptions.userTypes.find(
      userType => userType.name === name
    );
  }
}
