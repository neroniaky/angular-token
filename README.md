![Angular-Token](assets/angular-token-logo.png)

# Angular-Token

[![Greenkeeper badge](https://badges.greenkeeper.io/neroniaky/angular-token.svg)](https://greenkeeper.io/)
[![Join the chat at https://gitter.im/lynndylanhurley/devise_token_auth](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/angular-token/Lobby)
[![npm version](https://badge.fury.io/js/angular-token.svg)](https://badge.fury.io/js/angular-token)
[![npm downloads](https://img.shields.io/npm/dt/angular-token.svg)](https://npmjs.org/angular-token)
[![Build Status](https://travis-ci.org/neroniaky/angular-token.svg?branch=master)](https://travis-ci.org/neroniaky/angular-token)
[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

Token based authentication service for Angular with multiple user support. Angular-Token works best with the [devise token auth](https://github.com/lynndylanhurley/devise_token_auth) gem for Rails.
Angular-Token is currently in Beta. Any contribution is much appreciated.

A sample application can be found [here](https://github.com/neroniaky/angular-token-example).

## Install
0. Set up a Rails with [Devise Token Auth](https://github.com/lynndylanhurley/devise_token_auth)

1. Install Angular-Token via NPM with
    ```bash
    npm install angular-token
    ```

2. Import and add `AngularTokenModule` to your main module and call the 'forRoot' function with the config.
    ```javascript
    import { AngularTokenModule } from 'angular-token';

    @NgModule({
        imports: [
            BrowserModule,
            AngularTokenModule.forRoot({
              ...
            })
        ],
        declarations: [ AppComponent ],
        providers:    [ AngularTokenModule ],
        bootstrap:    [ AppComponent ]
    })
    ```
## Use

3. Register your user
    ```javascript
    constructor(private tokenService: AngularTokenService) { }

    this.tokenService.registerAccount({
        email:                'example@example.org',
        password:             'secretPassword',
        passwordConfirmation: 'secretPassword'
    }).subscribe(
        res =>      console.log(res),
        error =>    console.log(error)
    );
    ```

4. Sign in your user
    ```javascript
    constructor(private tokenService: AngularTokenService) { }

    this.tokenService.signIn({
        email:    'example@example.org',
        password: 'secretPassword'
    }).subscribe(
        res =>      console.log(res),
        error =>    console.log(error)
    );
    ```

5. Now you can use HttpClient to access private resources
    ```javascript
    constructor(http: HttpClient) { }

    this.http.get('private_resource').subscribe(
        res =>      console.log(res),
        error =>    console.log(error)
    );
    ```

## Content
- [Configuration](#configuration)
- [Session Management](#session-management)
    - [`.signIn()`](#signin)
    - [`.signOut()`](#signout)
    - [`.registerAccount()`](#registeraccount)
    - [`.deleteAccount()`](#deleteaccount)
    - [`.validateToken()`](#validatetoken)
    - [`.updatePassword()`](#updatepassword)
    - [`.resetPassword()`](#resetpassword)
    - [`.signInOAuth()`](#signinoauth)
    - [`.processOAuthCallback()`](#processoauthcallback)
- [Multiple User Types](#multiple-user-types)
- [Route Guards](#route-guards)
- [Service Methods](#service-methods)
    - [`.request()`](#request)
    - [`.userSignedIn()`](#usersignedin)
    - [`.currentUserType`](#currentusertype)
    - [`.currentUserData`](#currentuserdata)
    - [`.currentAuthData`](#currentauthdata)
- [Common Problems](#common-problems)
- [Development](#development)
    - [Testing](#testing)
    - [Credits](#credits)
    - [License](#license)

## Configuration
Configuration options can be passed as `Angular2TokenOptions` via `forRoot()`.

### Default Configuration
```javascript
@NgModule({
    imports: [
        AngularTokenModule.forRoot({
            apiBase:                    null,
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

            oAuthBase:                  window.location.origin,
            oAuthPaths: {
                github:                 'auth/github'
            },
            oAuthCallbackPath:          'oauth_callback',
            oAuthWindowType:            'newWindow',
            oAuthWindowOptions:         null,

            userTypes?:                 null,
            loginField?:                string;

            globalOptions: {
                headers: {
                    'Content-Type':     'application/json',
                    'Accept':           'application/json'
                }
            }
        });
    }
}
```

| Options                                 | Description                              |
| --------------------------------------- | ---------------------------------------- |
| `apiBase?: string`                      | Sets the server for all API calls.       |
| `apiPath?: string`                      | Sets base path all operations are based on |
| `signInPath?: string`                   | Sets path for sign in                    |
| `signInRedirect?: string`               | Sets redirect path for failed CanActivate |
| `signInStoredUrlStorageKey?: string`    | Sets locale storage key to store URL before displaying signIn page |
| `signOutPath?: string`                  | Sets path for sign out                   |
| `validateTokenPath?: string`            | Sets path for token validation           |
| `signOutFailedValidate?: boolean`       | Signs user out when validation returns a 401 status |
| `registerAccountPath?: string`          | Sets path for account registration       |
| `deleteAccountPath?: string`            | Sets path for account deletion           |
| `registerAccountCallback?: string`      | Sets the path user are redirected to after email confirmation for registration |
| `updatePasswordPath?: string`           | Sets path for password update            |
| `resetPasswordPath?: string`            | Sets path for password reset             |
| `resetPasswordCallback?: string`        | Sets the path user are redirected to after email confirmation for password reset |
| `userTypes?: UserTypes[]`               | Allows the configuration of multiple user types (see [Multiple User Types](#multiple-user-types)) |
| `loginField?: string`                   | Allows the ability to configure a custom login field. Defaults to 'email' |
| `globalOptions?: GlobalOptions`         | Allows the configuration of global options (see below) |
| `oAuthBase?: string`                    | Configure the OAuth server (used for backends on a different url) |
| `oAuthPaths?: { [key:string]: string }` | Sets paths for sign in with OAuth        |
| `oAuthCallbackPath?:  string`           | Sets path for OAuth sameWindow callback  |
| `oAuthWindowType?:`string`              | Window type for Oauth authentication     |
| `oAuthWindowOptions?: { [key:string]: string }` | Set additional options to pass into `window.open()` |
### Global Options
| Options                               | Description                                     |
| ------------------------------------- | ----------------------------------------------- |
| `headers?: { [key:string]: string; }` | Define custom global headers as hashmap. Be careful when overwriting the default options, `devise token auth` will refuse requests without the `Content-Type`-Header set |

Further information on paths/routes can be found at
[devise token auth](https://github.com/lynndylanhurley/devise_token_auth#usage-tldr)

## Session Management
Once initialized `AngularTokenService` offers methods for session management.

### .signIn()
The signIn method is used to sign in the user with email address and password.
The optional parameter `type` specifies the name of UserType used for this session.

`signIn({email: string, password: string, userType?: string}): Observable<Response>`

#### Example:
```javascript
this.tokenService.signIn({
    email:    'example@example.org',
    password: 'secretPassword'
}).subscribe(
    res =>      console.log(res),
    error =>    console.log(error)
);
```

### .signOut()
The signOut method destroys session and session storage.

`signOut(): Observable<Response>`

#### Example:
```javascript
this.tokenService.signOut().subscribe(
    res =>      console.log(res),
    error =>    console.log(error)
);
```

### .registerAccount()
Sends a new user registration request to the Server.

`registerAccount({email: string, password: string, passwordConfirmation: string, userType?: string}): Observable<Response>`

#### Example:
```javascript
this.tokenService.registerAccount({
    email:                'example@example.org',
    password:             'secretPassword',
    passwordConfirmation: 'secretPassword'
}).subscribe(
    res =>      console.log(res),
    error =>    console.log(error)
);
```

### .deleteAccount()
Deletes the account for the signed in user.

`deleteAccount(): Observable<Response>`

#### Example:
```javascript
this.tokenService.deleteAccount().subscribe(
    res =>      console.log(res),
    error =>    console.log(error)
);
```

### .validateToken()
Validates the current token with the server.

`validateToken(): Observable<Response>`

#### Example:
```javascript
this.tokenService.validateToken().subscribe(
    res =>      console.log(res),
    error =>    console.log(error)
);
```

### .updatePassword()
Updates the password for the logged in user.
`updatePassword({password: string, passwordConfirmation: string, passwordCurrent: string, userType?: string, resetPasswordToken?: string}): Observable<Response>`

#### Example:
```javascript
this.tokenService.updatePassword({
    password:             'newPassword',
    passwordConfirmation: 'newPassword',
    passwordCurrent:      'oldPassword',
    resetPasswordToken:   'resetPasswordToken',
}).subscribe(
    res =>      console.log(res),
    error =>    console.log(error)
);
```

### .resetPassword()
Request a password reset from the server.

`resetPassword({email: string, userType?: string}): Observable<Response>`

#### Example:
```javascript
this.tokenService.resetPassword({
    email: 'example@example.org',
}).subscribe(
    res =>      console.log(res),
    error =>    console.log(error)
);
```

### .signInOAuth()
Initiates OAuth authentication flow. Currently, it supports two window modes:
`newWindow` (default) and `sameWindow` (settable in config as `oAuthWindowType`).
- When `oAuthWindowType` is set to `newWindow`, `.signInOAuth()` opens a new window and returns an observable.

- When `oAuthWindowType` is set to `sameWindow`, `.signInOAuth()` returns nothing and redirects user to auth provider.
After successful authentication, it redirects back to `oAuthCallbackPath`. Application router needs to intercept
this route and call `processOAuthCallback()` to fetch `AuthData` from params.

`signInOAuth(oAuthType: string)`

#### Example:

```javascript
this.tokenService.signInOAuth(
'github'
).subscribe(
    res =>      console.log(res),
    error =>    console.log(error)
);
```

### .processOAuthCallback()
Fetches AuthData from params sent via OAuth redirection in `sameWindow` flow.

`processOAuthCallback()`

#### Example

Callback route:
```javascript
RouterModule.forRoot([
  { path: 'oauth_callback', component: OauthCallbackComponent }
])
```

Callback component:
```javascript
@Component({
  template: ''
})
export class OauthCallbackComponent implements OnInit {
  constructor(private tokenService: AngularTokenService) {}

  ngOnInit() {
    this.tokenService.processOAuthCallback();
  }
}
```

## Multiple User Types
An array of `UserType` can be passed in `Angular2TokenOptions` during `init()`.
The user type is selected during sign in and persists until sign out.
`.currentUserType` returns the currently logged in user.

#### Example:
```javascript
this.tokenService.init({
    userTypes: [
        { name: 'ADMIN', path: 'admin' },
        { name: 'USER', path: 'user' }
    ]
});

this.tokenService.signIn({
    email:    'example@example.com',
    password: 'secretPassword',
    userType: 'ADMIN'
})

this.tokenService.currentUserType; // ADMIN
```

## Route Guards
Angular-Token implements the `CanActivate` interface, so it can directly be used as a route guard.
If the `signInRedirect` option is set the user will be redirected on a failed (=false) CanActivate using `Router.navigate()`.
It currently does not distinguish between user types.

#### Example:
```javascript
const routerConfig: Routes = [
    {
        path: '',
        component: PublicComponent
    }, {
        path: 'restricted',
        component: RestrictedComponent,
        canActivate: [AngularTokenService]
    }
];
```

## Service Methods
More advanced methods can be used if a higher degree of customization is required.

### .userSignedIn()
Returns `true` if a user is signed in. It does not distinguish between user types.

`userSignedIn(): boolean`

### .currentUserType
Returns current user type as string like specified in the options.

`get currentUserType(): string`

### .currentUserData
Returns current user data as returned by devise token auth.
This variable is `null` after page reload until the `.validateToken()` call is answerd by the backend.

`get currentUserData(): UserData`

### .currentAuthData
Returns current authentication data which are used to set auth headers.

`get currentAuthData(): AuthData`

### .currentAuthHeaders
Returns current authentication data as an HTTP ready Header object.

`get currentAuthHeaders(): Header`

### Redirect original requested URL
If you want to redirect to the protected URL after signing in, you need to set `signInStoredUrlStorageKey` and in your code you can do something like this

```js
this.tokenService.signIn({
    email:    'example@example.org',
    password: 'secretPassword'
}).subscribe(
    res => {
        // You have to add Router DI in your component
        this.router.navigateByUrl(localStorage.getItem('redirectTo'));
    },
    error =>    console.log(error)
);
```
## Common Problems

### CORS Configuration
If you are using CORS in your Rails API make sure that `Access-Control-Expose-Headers` includes `access-token`, `expiry`, `token-type`, `uid`, and `client`.
For the rack-cors gem this can be done by adding the following to its config.
More information can be found [here](https://github.com/lynndylanhurley/devise_token_auth#cors).
    ```ruby
    :expose  => ['access-token', 'expiry', 'token-type', 'uid', 'client']
    ```

### Missing Routes
Make sure that your projects includes some kind of routing.

## Development
1. Clone the repository
    ```bash
    git clone https://github.com/neroniaky/angular-token.git
    ```

2. Move to the repository
    ```bash
    cd angular-token
    ```

3. Install packages
    ```bash
    yarn install
    ```

4. Build Library
    ```bash
    yarn build:lib
    ```

5. Run example project
    ```bash
    ng serve
    ```

### Testing
```bash
ng test:lib
```

## Contributors

| [<img src="https://avatars3.githubusercontent.com/u/11535793?v=4" width="100px;"/><br /><sub>Jan-Philipp Riethmacher</sub>](https://github.com/neroniaky) | [<img src="https://avatars.githubusercontent.com/u/7848606?v=4" width="100px;"/><br /><sub>Arjen Brandenburgh</sub>](https://github.com/arjenbrandenburgh) | [<img src="https://avatars3.githubusercontent.com/u/1176341?v=4" width="100px;"/><br /><sub>Raymond Suelzer</sub>](https://github.com/raysuelzer) |
| :---: | :---: | :---: |

### License
The MIT License (see the [LICENSE](https://github.com/neroniaky/angular-token/blob/master/LICENSE) file for the full text)