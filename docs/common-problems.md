## CORS Configuration
If you are using CORS in your Rails API make sure that `Access-Control-Expose-Headers` includes `access-token`, `expiry`, `token-type`, `uid`, and `client`.
For the rack-cors gem this can be done by adding the following to its config.
More information can be found [here](https://github.com/lynndylanhurley/devise_token_auth#cors).
    
```ruby
:expose  => ['access-token', 'expiry', 'token-type', 'uid', 'client']
```

## Missing "@angular/core" and/or "rxjs"

I got the following error
`You seem to not be depending on "@angular/core" and/or "rxjs". This is an error.`

To fix it
`npm link`
`ng serve`
