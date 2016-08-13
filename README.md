# Angular2-Token
[![npm version](https://badge.fury.io/js/angular2-token.svg)](https://badge.fury.io/js/angular2-token)
[![npm downloads](https://img.shields.io/npm/dt/angular2-token.svg)](https://npmjs.org/angular2-token)
[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

## About
Token based authentication service for Angular2 with multiple user support. Angular2-Token works best with the
[devise token auth](https://github.com/lynndylanhurley/devise_token_auth) gem for Rails.

Angular2-Token is currently in Alpha. Any contribution is much appreciated.

## Content
- [Installation](#installation)
- [Configuration](#configuration)
- [Service Methods](#methods)
    - [`.signIn()`](#signin)
    - [`.signOut()`](#signout)
    - [`.registerAccount()`](#registeraccount)
    - [`.deleteAccount()`](#deleteaccount)
    - [`.validateToken()`](#validatetoken)
    - [`.updatePassword()`](#updatepassword)
- [HTTP Service Wrapper](#http-service-wrapper)
- [Multiple User Types](#multiple-user-types)
- [Testing](#testing)
- [Credits](#credits)
- [License](#license)

## Installation
1. Install Angular2-Token via NPM with
    ```bash
    npm install angular2-token --save
    ```

2. Import and add `Angular2TokenService` to your module.
    ```javascript
    import { Angular2TokenService } from 'angular2-token';

    @NgModule({
        imports:      [ BrowserModule ],
        declarations: [ AppComponent ],
        providers:    [ Angular2TokenService ],
        bootstrap:    [ AppComponent ]
    })
    ```

3. Inject `Angular2TokenService` into your component and call `.init()`.
    ```javascript
    constructor(private _tokenService: Angular2TokenService) {
        this._tokenService.init();
    }
    ```

## Configuration
Configuration options can be passed as `Angular2TokenOptions` via `.init()`.

### Default Configuration
```javascript
constructor(private _tokenService: Angular2TokenService) {
    this._tokenService.init({
        apiPath:                null,
        signInPath:             'auth/sign_in',
        signOutPath:            'auth/sign_out',
        validateTokenPath:      'auth/validate_token',
        registerAccountPath:    'auth',
        deleteAccountPath:      'auth',
        emailRegistrationPath:  window.location.href,
        updatePasswordPath:     'auth/password',
        resetPasswordPath:      'auth/password',
        emailPasswordPath:      window.location.href,
        userTypes:              null
    });
}
```

### Configuration Options
- `apiPath?: string` - Sets base path all operations are based on
- `signInPath?: string` - Sets path for sign in
- `signOutPath?: string` - Sets path for sign out
- `validateTokenPath?: string` - Sets path for token validation
- `registerAccountPath?: string` - Sets path for account registration
- `deleteAccountPath?: string` - Sets path for account deletion
- `emailRegistrationPath?: string` - Sets the path user are redirected to after email confirmation for registration
- `updatePasswordPath?: string` - Sets path for password update
- `resetPasswordPath?: string` - Sets path for password reset
- `emailPasswordPath?: string` - Sets the path user are redirected to after email confirmation for password reset
- `userTypes?: UserTypes[]` - Allows the configuration of multiple user types

Further information on paths/routes can be found at
[devise token auth](https://github.com/lynndylanhurley/devise_token_auth#usage-tldr)

## Service Methods
Once initialized `Angular2TokenService` offers methods for session management.

### .signIn()
The signIn method is used to sign in the user with email address and password.
The optional parameter `type` specifies the name of UserType used for this session.

`signIn(email: string, password: string, userType?: string): Observable<Response>`

#### Example:
```javascript
this._tokenService.signIn(
    'example@example.org',
    'password'
).subscribe(
    res => console.log(res),
    error => console.log(error)
);
```

### .signOut()
The signOut method destroys session and browsers session storage.

`signOut(): Observable<Response>`

#### Example:
```javascript
this._tokenService.signOut().subscribe(
    res => console.log(res),
    error => console.log(error)
);
```

### .registerAccount()
Sends a new user registration request to the Server.

`registerAccount(email: string, password: string, passwordConfirmation: string, userType?: string): Observable<Response>`

#### Example:
```javascript
this._tokenService.registerAccount(
    'example@example.org',
    'password',
    'password'
).subscribe(
    res => console.log(res),
    error => console.log(error)
);
```

### .deleteAccount()
Deletes the account for the signed in user.

`deleteAccount(): Observable<Response>`

#### Example:
```javascript
this._tokenService.deleteAccount().subscribe(
    res => console.log(res),
    error => console.log(error)
);
```

### .validateToken()
Validates the current token with the server.

`validateToken(): Observable<Response>`

#### Example:
```javascript
this._tokenService.validateToken().subscribe(
    res => console.log(res),
    error => console.log(error)
);
```

### .updatePassword()
Updates the password for the logged in user.

`updatePassword(currentPassword: string, password: string, passwordConfirmation: string): Observable<Response>`

#### Example:
```javascript
this._tokenService.updatePassword(
    'oldPassword',
    'newPassword',
    'newPassword'
).subscribe(
    res => console.log(res),
    error => console.log(error)
);
```

## HTTP Service Wrapper
`Angular2TokenService` wraps all standard Angular2 Http Service calls for authentication and token processing.
- `get(path: string, data?: any): Observable<Response>`
- `post(path: string, data: any): Observable<Response>`
- `put(path: string, data: any): Observable<Response>`
- `delete(path: string, data?: any): Observable<Response>`
- `patch(path: string, data: any): Observable<Response>`

#### Example:
```javascript
this._tokenService.get('my-resource/1').map(res => res.json()).subscribe(
    res => console.log(res),
    error => console.log(error)
);
```

## Multiple User Types
An Array of `UserType` can be passed in `Angular2TokenOptions` during `init()`.
The user type is selected during sign in and persists until sign out.
`.currentUser` returns the currently logged in user.

#### Example:
```javascript
this._tokenService.init({
    userTypes: [
        { name: 'ADMIN', path: 'admin' },
        { name: 'USER', path: 'user' }
    ]
});

this._tokenService.signIn(
    'example@example.com',
    'secretPassword',
    'ADMIN'
)

this._tokenService.currentUser; // ADMIN
```

## Testing
```bash
npm test
```

## Credits
Test config files based on [Angular2 Webpack Starter](https://github.com/AngularClass/angular2-webpack-starter) by AngularClass

## License
The MIT License (see the [LICENSE](https://github.com/neroniaky/angular2-token/blob/master/LICENSE) file for the full text)