An array of `UserType` can be passed in `AngularTokenOptions` at the root module with`.forRoot()`.
The user type is selected during sign in and persists until sign out.
`.currentUserType()` returns the currently logged in user.

#### Example:
```javascript
this.tokenService.init({
  userTypes: [
    { name: 'ADMIN', path: 'admin' },
    { name: 'USER', path: 'user' }
  ]
});

this.tokenService.signIn({
  login:    'example@example.com',
  password: 'secretPassword',
  userType: 'ADMIN'
})

this.tokenService.currentUserType; // ADMIN
```

## Showing/Hiding Elements based on UserType
When wanting to show or hide certain elements based on the UserRole, the following directive can be used as guideline.

```javascript
import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AngularTokenService } from 'angular-token';

@Directive({
  selector: '[ifInRole]'
})
export class IfInRoleDirective implements OnInit {
  @Input('ifInRole') role: string;

  constructor(private viewContainer: ViewContainerRef,
              private templateRef: TemplateRef<any>,
              private tokenService: AngularTokenService) {
  }

  ngOnInit(): void {
    if (this.role === this.tokenService.currentUserType) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```

#### Example:
```html
<a routerLink="link1">Public link 1</a>
<a routerLink="link2">Public link 2</a>
<a *ifInRole="'user'" routerLink="private/link1">Private link 1</a>
<a *ifInRole="'admin'" routerLink="private/link2">Private link 2</a>
```