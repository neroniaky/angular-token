Configuration options can be passed as `AngularTokenOptions` via `forRoot()`.

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
    });
  }
}
```
### Path options
| Option                                  | Description                              |
| --------------------------------------- | ---------------------------------------- |
| `apiBase?: string`                      | Sets the server for all API calls.       |
| `apiPath?: string`                      | Sets base path all operations are based on |
| `signInPath?: string`                   | Sets path for sign in                    |
| `signInRedirect?: string`               | Sets redirect path for failed CanActivate |
| `signOutPath?: string`                  | Sets path for sign out                   |
| `validateTokenPath?: string`            | Sets path for token validation           |
| `registerAccountPath?: string`          | Sets path for account registration       |
| `deleteAccountPath?: string`            | Sets path for account deletion           |
| `updatePasswordPath?: string`           | Sets path for password update            |
| `resetPasswordPath?: string`            | Sets path for password reset             |
| `registerAccountCallback?: string`      | Sets the path user are redirected to after email confirmation for registration |
| `resetPasswordCallback?: string`        | Sets the path user are redirected to after email confirmation for password reset |

### Library behaviour options
| Option                                  | Description                              |
| --------------------------------------- | ---------------------------------------- |
| `signInStoredUrlStorageKey?: string`    | Sets locale storage key to store URL before displaying signIn page |
| `signOutFailedValidate?: boolean`       | Signs user out when validation returns a 401 status |
| `userTypes?: UserTypes[]`               | Allows the configuration of multiple user types (see [Multiple User Types](#multiple-user-types)) |
| `loginField?: string`                   | Allows the ability to configure a custom login field. Defaults to 'email' |

### OAuth options
| Options                                 | Description                                     |
| --------------------------------------- | ----------------------------------------------- |
| `oAuthPaths?: { [key:string]: string }` | Sets paths for sign in with OAuth               |
| `oAuthCallbackPath?:  string`           | Sets path for OAuth sameWindow callback         |
| `oAuthBase?: string`                    | Configure the OAuth server (used for backends on a different url) |
| `oAuthWindowType?:`string`              | Window type for Oauth authentication            |
| `oAuthWindowOptions?: { [key:string]: string }` | Set additional options to pass into `window.open()` |

Further information on paths/routes can be found at
[devise token auth](https://github.com/lynndylanhurley/devise_token_auth#usage-tldr).
