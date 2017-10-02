import { ActivatedRoute, Router, CanActivate } from '@angular/router';
import { Http, Response, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/filter';
import { SignInData, RegisterData, UpdatePasswordData, ResetPasswordData, UserData, AuthData, Angular2TokenOptions } from './angular2-token.model';
export declare class Angular2TokenService implements CanActivate {
    private http;
    private activatedRoute;
    private router;
    readonly currentUserType: string;
    readonly currentUserData: UserData;
    readonly currentAuthData: AuthData;
    readonly currentAuthHeaders: Headers;
    private atOptions;
    private atCurrentUserType;
    private atCurrentAuthData;
    private atCurrentUserData;
    constructor(http: Http, activatedRoute: ActivatedRoute, router: Router);
    userSignedIn(): boolean;
    canActivate(): boolean;
    init(options?: Angular2TokenOptions): void;
    /**
     *
     * Actions
     *
     */
    registerAccount(registerData: RegisterData): Observable<Response>;
    deleteAccount(): Observable<Response>;
    signIn(signInData: SignInData): Observable<Response>;
    signInOAuth(oAuthType: string): Observable<any>;
    processOAuthCallback(): void;
    signOut(): Observable<Response>;
    validateToken(): Observable<Response>;
    updatePassword(updatePasswordData: UpdatePasswordData): Observable<Response>;
    resetPassword(resetPasswordData: ResetPasswordData): Observable<Response>;
    /**
     *
     * HTTP Wrappers
     *
     */
    get(url: string, options?: RequestOptionsArgs): Observable<Response>;
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>;
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>;
    delete(url: string, options?: RequestOptionsArgs): Observable<Response>;
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response>;
    head(path: string, options?: RequestOptionsArgs): Observable<Response>;
    options(url: string, options?: RequestOptionsArgs): Observable<Response>;
    request(options: RequestOptionsArgs): Observable<Response>;
    private mergeRequestOptionsArgs(options, addOptions?);
    private handleResponse(response);
    /**
     *
     * Get Auth Data
     *
     */
    private tryLoadAuthData();
    private getAuthHeadersFromResponse(data);
    private getAuthDataFromPostMessage(data);
    private getAuthDataFromStorage();
    private getAuthDataFromParams();
    /**
     *
     * Set Auth Data
     *
     */
    private setAuthData(authData);
    /**
     *
     * Validate Auth Data
     *
     */
    private checkAuthData(authData);
    /**
     *
     * Construct Paths / Urls
     *
     */
    private getUserPath();
    private getApiPath();
    private getOAuthPath(oAuthType);
    private getOAuthUrl(oAuthPath, callbackUrl, windowType);
    /**
     *
     * OAuth
     *
     */
    private requestCredentialsViaPostMessage(authWindow);
    private oAuthWindowResponseFilter(data);
    /**
     *
     * Utilities
     *
     */
    private getUserTypeByName(name);
}
