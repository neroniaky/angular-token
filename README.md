# Angular2-Token
[![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)]([![npm](https://img.shields.io/npm/v/npm.svg?maxAge=2592000)]([![npm](https://img.shields.io/npm/l/express.svg?maxAge=2592000)](https://www.npmjs.com/package/angular2-token)))
[![npm version](https://badge.fury.io/js/angular2-token.svg)](https://badge.fury.io/js/angular2-token)
[![npm downloads](https://img.shields.io/npm/dt/angular2-token.svg)](https://npmjs.org/angular2-token)
[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

## About
Token based authentication service for Angular2 with multiple user support. Angular2-Token works best with the
[devise token auth](https://github.com/lynndylanhurley/devise_token_auth) gem for Rails.

Angular2-Token is currently in early Alpha. Any contribution is much appreciated.

## Install
Install Angular2-Token via NPM with
```bash
npm install angular2-token --save
```

## Setup
1. Import `Angular2TokenService` into your component
    ```javascript
    import { Angular2TokenService } from 'angular2-token';

    ```
2. Add `Angular2TokenService` as a provider to your component
    ```javascript
    @Component({
        selector: 'app',
        providers: [Angular2TokenService],
        templateUrl: './app.html',
    })
    ```

3. Inject `Angular2TokenService` into your component and call `.init()`
    ```javascript
    constructor(private _tokenService: Angular2TokenService) {
        this._tokenService.init();
    }
    ```

## Configuration
Configuration options can be passed as `Angular2TokenOptions` via `.init()`

### Default Configuration
```javascript
constructor(private _tokenService: Angular2TokenService) {
    this._tokenService.init({
        apiPath: '/',
        signInPath: 'auth/sign_in',
        signOutPath: 'auth/sign_out',
        validateTokenPath: 'auth/validate_token',
        updatePasswordPath: 'auth/password',
        userTypes: [
            { name: 'USER', path: 'users' }
        ]
    });
}
```

### Configuration Options
- `apiPath (?string)`: Sets base path all operations are based on
- `signInPath (?string)`: Sets sign_in path
- `signOutPath (?string)`: Sets sign_out path
- `validateTokenPath (?string)`: Sets validate_token path
- `updatePasswordPath (?string)`: Sets password path
- `userTypes (?UserTypes[])`: Allows the configuration of multiple user types

Further information on paths/routes can be found at
[devise token auth](https://github.com/lynndylanhurley/devise_token_auth#usage-tldr)

## Usage
Once initialized `Angular2TokenService` offers methods for session management and a Angular2 Http-Service wrapper.

### Log In
The logIn method is used to sign in the user with email address and password.
The optional parameter `type` specifies the name of UserType used for this session.

`logIn(email: string, password: string, userType?: string): Observable<Response>`

#### Example:
```javascript
this._tokenService.login('example@example.com', 'secretPassword', 'ADMIN').subscribe(
    res => console.log(res),
    error => console.log(error)
);
```

### Log Out
The logOut method destroys session and browsers session storage.

`logOut(): Observable<Response>`

#### Example:
```javascript
this._tokenService.logOut().subscribe(
    res => console.log(res),
    error => console.log(error)
);
```

### Validate Token
Validates the current token with the server.

`validateToken(): Observable<Response>`

#### Example:
```javascript
this._tokenService.validateToken().subscribe(
    res => console.log(res),
    error => console.log(error)
);
```

### Change Password
Updates the existing password for the logged in user.

`updatePassword(currentPassword: string, password: string, passwordConfirmation: string): Observable<Response>`

#### Example:
```javascript
this._tokenService.updatePassword('oldPassword', 'newPassword', 'newPassword').subscribe(
    res => console.log(res),
    error => console.log(error)
);
```

### HTTP Wrapper
`Angular2TokenService` wraps all standard Angular2 Http Service calls for authentication and token processing.
- `get(path: string): Observable<Response>`
- `post(path: string, data: any): Observable<Response>`
- `put(path: string, data: any): Observable<Response>`
- `delete(path: string): Observable<Response>`
- `patch(path: string, data: any): Observable<Response>`

#### Example:
```javascript
this._tokenService.get('myResource/1').map(res => res.json()).subscribe(
    res => console.log(res),
    error => console.log(error)
);
```

## License
The MIT License (see the [LICENSE](https://github.com/neroniaky/angular2-token/blob/master/LICENSE) file for the full text)