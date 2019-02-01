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

For the reset password flow where the user is not logged in, this library does not currently support a password update via this updatePassword call. This is because an update password call in that scenario requires the auth headers to be created from the query strings in the redirected URL sent from the server once the email reset link is clicked. You will need to provide this functionality yourself and use the .request() method below to send a PUT to the password endpoint with the correct headers. Your code should copy over the client_id, expiry, token and uid query string values from the redirected URL into their respective header properties.

`updatePassword({password: string, passwordConfirmation: string, passwordCurrent: string, userType?: string}): Observable<Response>`

#### Example:
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

## .resetPassword()
Request a password reset from the server.

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