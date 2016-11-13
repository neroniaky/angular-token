import { Routes, RouterModule } from '@angular/router';
import { Angular2TokenService } from '../angular2-token.service';

import {
    A2tUiComponent,
    A2tSignInComponent,
    A2tSignUpComponent,
    A2tResetPasswordComponent,
    A2tUpdatePasswordComponent
} from './';

const routes: Routes = [{
        path: 'session',
        component: A2tUiComponent,
        children: [
            { path: 'sign-in', component: A2tSignInComponent },
            { path: 'sign-up', component: A2tSignUpComponent },
            { path: 'reset-password', component: A2tResetPasswordComponent },
            { 
                path: 'update-password', 
                component: A2tUpdatePasswordComponent, 
                canActivate: [Angular2TokenService] 
            }
        ]
}];

export const a2tRoutes = RouterModule.forChild(routes);
