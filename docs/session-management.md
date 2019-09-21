Once initialized `AngularTokenService` offers methods for session management:

- [`.signIn()`](#signin)
- [`.signOut()`](#signout)
- [`.registerAccount()`](#registeraccount)
- [`.deleteAccount()`](#deleteaccount)
- [`.validateToken()`](#validatetoken)
- [`.updatePassword()`](#updatepassword)
- [`.resetPassword()`](#resetpassword)
- [`.signInOAuth()`](#signinoauth)
- [`.processOAuthCallback()`](#processoauthcallback)

## .signIn()
The signIn method is used to sign in the user with login (e.g. email address) and password.
The optional parameter `type` specifies the name of UserType used for this session.

`signIn({login: string, password: string, userType?: string}): Observable<Response>`

#### Example:
```javascript
this.tokenService.signIn({
  login:    'example@example.org',
  password: 'secretPassword'
}).subscribe(
  res =>      console.log(res),
  error =>    console.log(error)
);
```

## .signOut()
The signOut method destroys session and session storage.

`signOut(): Observable<Response>`

#### Example:
```javascript
this.tokenService.signOut().subscribe(
  res =>      console.log(res),
  error =>    console.log(error)
);
```

## .registerAccount()
Sends a new user registration request to the Server.

`registerAccount({login: string, password: string, passwordConfirmation: string, userType?: string}): Observable<Response>`

#### Example:
```javascript
this.tokenService.registerAccount({
  login:                'example@example.org',
  password:             'secretPassword',
  passwordConfirmation: 'secretPassword'
}).subscribe(
  res =>      console.log(res),
  error =>    console.log(error)
);
```

## .deleteAccount()
Deletes the account for the signed in user.

`deleteAccount(): Observable<Response>`

#### Example:
```javascript
this.tokenService.deleteAccount().subscribe(
  res =>      console.log(res),
  error =>    console.log(error)
);
```

## .validateToken()
Validates the current token with the server.

`validateToken(): Observable<Response>`

#### Example:
```javascript
this.tokenService.validateToken().subscribe(
  res =>      console.log(res),
  error =>    console.log(error)
);
```

## .updatePassword()
Updates the password for the logged in user. Note that there are two main flows that this is used for - 
a user changing their password while they are already logged in and a "forgot password" flow where the user is doing an update via the link in a reset password email. 

For a normal password update, you need to send the new password twice, for confirmation and you may also have to send the current password for extra security. The setting "check_current_password_before_update" in the Devise Token Auth library is used to control if the current password is required or not.

For the "forgot password" flow where the user is not logged in, review the .resetPassword() documentation below to understand how .updatePassword() fits into that flow. This library's updatePassword() in a "forgot password" flow is known to work with Angular apps using PathLocationStrategy (the default for Angular) but an [issue](https://github.com/lynndylanhurley/devise_token_auth/issues/599) with the Devise Token Auth library currently prevents apps using HashLocationStrategy from working. (See [https://angular.io/api/common/LocationStrategy](https://angular.io/api/common/LocationStrategy) for an explanation of the two strategies). A PR has been created on the Devise Token Auth library to fix this - watch [PR 1341](https://github.com/lynndylanhurley/devise_token_auth/pull/1341) for the current status on that. Only password and new password are required to be sent for a "forgot password" password update request - the optional resetPasswordToken is not required. Note however that the server library Devise Token Auth has a new feature (currently unreleased in the gem) whereby you can add the resetPasswordToken into this request and it will auth using that token and not require the client lib to add any auth headers to the request, as it currently does.  See the section [Mobile alternative flow (use reset_password_token)](https://devise-token-auth.gitbook.io/devise-token-auth/usage/reset_password) in the server side library's documentation.

`updatePassword({password: string, passwordConfirmation: string, passwordCurrent?: string, userType?: string, resetPasswordToken?: string}): Observable<Response>`
` `
#### Example (change password):
```javascript
this.tokenService.updatePassword({
  password:             'newPassword',
  passwordConfirmation: 'newPassword',
  passwordCurrent:      'oldPassword',
}).subscribe(
  res =>      console.log(res),
  error =>    console.log(error)
);
```

#### Example (reset password):
```javascript
this.tokenService.updatePassword({
  password:             'newPassword',
  passwordConfirmation: 'newPassword',
}).subscribe(
  res =>      console.log(res),
  error =>    console.log(error)
);
```

## .resetPassword()
Request a password reset from the server (aka "forgot password" flow). This only asks the server to issue an email with a reset password link it. Once that link is clicked, the server will auth against the reset token in the link, and redirect to your configured resetPasswordCallback url, which should be a component that asks for the new password and confirmation. At that point you are effectively logged into the server with a temporary session and this lib will have valid auth headers ready to be added to the final step which is to issue an updatePassword to actually do the change. The addition of auth headers to that updatePassword request is handled automatically by this lib, you don't need to do anything in your component other than issue the update request. The server side library Devise Token Auth has a useful description of the flow at [https://devise-token-auth.gitbook.io/devise-token-auth/usage/reset_password](https://devise-token-auth.gitbook.io/devise-token-auth/usage/reset_password)

`resetPassword({login: string, userType?: string}): Observable<Response>`

#### Example:
```javascript
this.tokenService.resetPassword({
  login: 'example@example.org',
}).subscribe(
  res =>      console.log(res),
  error =>    console.log(error)
);
```

## .signInOAuth()
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

## .processOAuthCallback()
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
