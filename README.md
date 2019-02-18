![Angular-Token](https://raw.githubusercontent.com/neroniaky/angular-token/master/docs/angular-token-logo.png)

[![npm version](https://badge.fury.io/js/angular-token.svg)](https://badge.fury.io/js/angular-token)
[![npm downloads](https://img.shields.io/npm/dt/angular-token.svg)](https://npmjs.org/angular-token)
[![Build Status](https://travis-ci.org/neroniaky/angular-token.svg?branch=master)](https://travis-ci.org/neroniaky/angular-token)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)

🔑 Token based authentication service for Angular with interceptor and multi-user support. Works best with the [devise token auth](https://github.com/lynndylanhurley/devise_token_auth) gem for Rails.

👋 This library has been renamed to **Angular-Token**! Please follow the [migration guide](https://angular-token.gitbook.io/docs/migrate-to-7).

---

### Quick Links

- 🚀 View to demo on [Stackblitz](https://stackblitz.com/github/neroniaky/angular-token)
- ✨ Learn about it on the [docs site](https://angular-token.gitbook.io/docs)
- 🔧 Support us by [contributing](https://angular-token.gitbook.io/docs/contribute)

---

## Install
0. Set up a Rails with [Devise Token Auth](https://github.com/lynndylanhurley/devise_token_auth)

1. Install Angular-Token via NPM with
    ```bash
    npm install angular-token
    ```

2. Import and add `AngularTokenModule` to your main module and call the 'forRoot' function with the config. Make sure you have `HttpClientModule` imported too.
    ```javascript
    import { AngularTokenModule } from 'angular-token';

    @NgModule({
        imports: [
            ...,
            HttpClientModule,
            AngularTokenModule.forRoot({
              ...
            })
        ],
        declarations: [ ... ],
        providers:    [ AngularTokenModule ],
        bootstrap:    [ ... ]
    })
    ```
## Use

3. Register your user
    ```javascript
    constructor(private tokenService: AngularTokenService) { }

    this.tokenService.registerAccount({
        login:                'example@example.org',
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
        login:    'example@example.org',
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

## Contributors

| [<img src="https://avatars3.githubusercontent.com/u/11535793?v=4" width="100px;"/><br /><sub>Jan-Philipp Riethmacher</sub>](https://github.com/neroniaky) | [<img src="https://avatars.githubusercontent.com/u/7848606?v=4" width="100px;"/><br /><sub>Arjen Brandenburgh</sub>](https://github.com/arjenbrandenburgh)
| :---: | :---: |

### License
The MIT License (see the [LICENSE](https://github.com/neroniaky/angular-token/blob/master/LICENSE) file for the full text)
