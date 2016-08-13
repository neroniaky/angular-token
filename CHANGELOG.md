# Change Log

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