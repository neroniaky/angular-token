# Change Log

## v0.2.0-beta.5
**Bugfixes:**
- Fix tsc noUnusedParameters validation
- Remove unnecessary console output, fixes #72
- Added relative route paths, fixes #79

## v0.2.0-beta.4
**Breaking Changes:**
- Changed name of `.sendHttpRequest()` method to `.request()`
**Featues:**
- Added `RequestOptionsArgs` to all HTTP-Wrappers
**Bugfixes:**
- Fixed OAuth Implementation

## v0.2.0-beta.1
**Bugfixes:**
- Changed import order of BaseField to fix angular-cli import

## v0.2.0-beta.1
**Breaking changes:**
- Added Quickstart UI Module (README pending)
- Changed parameters for `signIn()`, `registerAccount()`, `updatePassword()`, `resetPassword()`

## v0.1.16
**Featues:**
- Added `userSignedIn()` method
- Added `currentAuthData` getter

**Bugfixes:**
- Fix `CanActivate` on page reload

## v0.1.15
**Featues:**
- Added global options for setting custom global headers

## v0.1.14
**Bugfixes:**
- Fixes auth data retrival from http paramater, fixes #29

## v0.1.13
**Features:**
- Added sign in redirect to `CanActivate` interface

## v0.1.12
**Breaking changes:**
- Changed paramater type of `sendHttpRequest(requestOptions: RequestOptions)`
- `sendHttpRequest()` does not add `apiPath` to path anymore

## v0.1.8 & v0.1.9
**Features:**
- Updated Dependencies to Angular2 Final

## v0.1.7
**Features:**
- Added .head() and .options() HTTP-wrapper
- Added general HTTP-wrapper .sendHttpRequest()

## v0.1.6
**Bugfixes:**
- Added route guard support for CanActivate

## v0.1.5
**Bugfixes:**
- Fix broken sourcemap paths in npm package

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