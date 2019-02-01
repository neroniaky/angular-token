The library has been renamed to **Angular-Token** and now includes Http Interceptor support. Please follow the steps below to upgrade from older versions.

### 1. Install new NPM package
The name of the npm has been changed as well. Please uninstall the older package and install the new one.
```bash
npm uninstall angular2-token

npm install angular-token
```

### 2. Change imports
Change all imports form 'angular2-token' to 'angular-token'. The module, service and models imported have been renamed as well. Removing the '2' in each name should do the trick.

#### Before:
```js
import { 
  Angular2TokenService,
  Angular2TokenModule,
  Angular2TokenOptions
  ...
} from 'angular2-token';
```

#### After:
```js
import { 
  AngularTokenService,
  AngularTokenModule,
  AngularTokenOptions
  ...
} from 'angular-token';
```

### 3. Change from Service import to Module import
Import `AngularTokenModule` in your root module instead of providing `Angular2TokenService`. Also remove the `.init()` and provide the `Angular2TokenOptions` via the `.forRoot()` function.

#### Before:
```js
// Root Module
@NgModule({
  imports:      [ ... ],
  declarations: [ ... ],
  providers:    [ Angular2TokenService ],
  bootstrap:    [ ... ]
})

// Root Component
constructor(private tokenService: Angular2TokenService) {
  this.tokenService.init();
}
```

#### After:
```js
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

### 4. Update '.signIn()', '.register()' and '.resetPassword()' to use 'login' rather than 'email'. 
To allow for more flexibility in the login, we changed the models to accept 'login' rather than 'email'.

#### Before:
```js
constructor(private tokenService: Angular2TokenService) { }

this.tokenService.signIn({
    email:    'example@example.org',
    password: 'secretPassword'
}).subscribe(
    res =>      console.log(res),
    error =>    console.log(error)
);
```

#### After:
```js
this.tokenService.signIn({
    login:    'example@example.org',
    password: 'secretPassword'
}).subscribe(
    res =>      console.log(res),
    error =>    console.log(error)
);
```

### 5. Use regular HttpClient calls 
Replace all tokenService wrapper calls (get, post, put, delete, etc) with regular HttpClient calls.

#### Before:
```js
constructor(private tokenService: Angular2TokenService) { }

this.tokenService.get('my-resource/1').subscribe(
  res =>    console.log(res),
  error =>  console.log(error)
);
```

#### After:
```js
constructor(private http: HttpClient) { }

this.http.get('my-resource/1').subscribe(
  res =>    console.log(res),
  error =>  console.log(error)
);
```