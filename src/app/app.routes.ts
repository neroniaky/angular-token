import { RouterModule, Routes } from '@angular/router';
import { AngularTokenService } from '../../projects/angular-token/src/public_api';

import { ExampleComponent } from './example/example.component';
import { RestrictedComponent } from './restricted/restricted.component';

const routerConfig: Routes = [
  { path: '', component: ExampleComponent },
  { path: 'restricted', component: RestrictedComponent, canActivate: [AngularTokenService] }
];

export const routes = RouterModule.forRoot(routerConfig);
