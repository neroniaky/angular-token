import { RouterModule, Routes } from '@angular/router';

import { ExampleComponent } from './example/example.component';
import { RestrictedComponent } from './restricted/restricted.component';

import { AngularTokenService } from 'angular-token';

const routerConfig: Routes = [
  { path: '', component: ExampleComponent },
  { path: 'restricted', component: RestrictedComponent, canActivate: [AngularTokenService] }
];

export const routes = RouterModule.forRoot(routerConfig, { useHash: true });
