## Route Guards
Angular-Token implements the `CanActivate` interface, so it can directly be used as a route guard.
If the `signInRedirect` option is set the user will be redirected on a failed (=false) CanActivate using `Router.navigate()`.
It currently does not distinguish between user types.

#### Example:
```javascript
const routerConfig: Routes = [
  {
    path: '',
    component: PublicComponent
  }, {
    path: 'restricted',
    component: RestrictedComponent,
    canActivate: [AngularTokenService]
  }
];
```

## Redirect original requested URL
If you want to redirect to the protected URL after signing in, you need to set `signInStoredUrlStorageKey` and in your code you can do something like this

#### Example:
```js
this.tokenService.signIn({
  email:    'example@example.org',
  password: 'secretPassword'
}).subscribe(
  res => {
    // You have to add Router DI in your component
    this.router.navigateByUrl(localStorage.getItem('redirectTo'));
  },
  error =>    console.log(error)
);
```