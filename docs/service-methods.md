More advanced methods can be used if a higher degree of customisation is required.

## .userSignedIn()
Returns `true` if a user is signed in. It does not distinguish between user types.

```js
userSignedIn(): boolean
```

## .currentUserType
Returns current user type as string like specified in the options.

```js
get currentUserType(): string
```

## .currentUserData
Returns current user data as returned by devise token auth.
This variable is `null` after page reload until the `.validateToken()` call is answerd by the backend.

```js
get currentUserData(): UserData
```

## .currentAuthData
Sets or returns current authentication data which are used to set auth headers.

```js
get currentAuthData(): AuthData

set currentAuthData(authData: AuthData)
```

## .tokenOptions
Sets or returns the current Options.

```js
get tokenOptions(): AngularTokenOptions

set tokenOptions(options: AngularTokenOptions)
```