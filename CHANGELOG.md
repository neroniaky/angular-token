# Change Log

## v0.1.4
**Features:**
- Added packaged library to npm package for systemjs support (fixes [#6](https://github.com/neroniaky/angular2-token/issues/6))
- Update Dependencies to Angular2 RC6

## v0.1.3
**Bugfixes:**
- Removes deprecated RouterState.queryParams for ActivatedRoute.params (fixes [#5](https://github.com/neroniaky/angular2-token/issues/5))

## v0.1.2
**Features:**
- Added `requestOptions` to parameter to all HTTP wrapper methods
- Added getter method `currentUserData`

**Breaking changes:**
- Changed `updatePasswordPath` in default options to `'auth'`
- Changed name of getter method `currentUser` to `currentUserType`

## v0.1.0
**Features:**
- Added tests

## v0.0.6 & v0.0.5
**Features:**
- Added `resetPassword()` for user password reset

**Breaking changes:**
- Changed structure of `Angular2TokenOptions`
- Changed parameters of `.updatePassword()`

## v0.0.4
**Features:**
- Added `registerAccount()` for account registration
- Added `deleteAccount()` for account deletion

**Bugfixes:**
- Upgraded to RC5, closes [#1](https://github.com/neroniaky/angular2-token/issues/1)

**Breaking changes:**
- Renamed `logIn()` to `signIn()` to match with devise token auth routes
- Renamed `logOut()` to `signOut()` to match with devise token auth routes

## v0.0.3
**Breaking changes:**
- `userTypes` in `Angular2TokenOptions` is `null` by default
- `apiPath` in `Angular2TokenOptions` adds `'/'` automatically