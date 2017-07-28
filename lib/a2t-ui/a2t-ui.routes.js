import { RouterModule } from '@angular/router';
import { Angular2TokenService } from '../angular2-token.service';
import { A2tUiComponent } from './a2t-ui.component';
import { A2tSignInComponent } from './a2t-sign-in/a2t-sign-in.component';
import { A2tSignUpComponent } from './a2t-sign-up/a2t-sign-up.component';
import { A2tResetPasswordComponent } from './a2t-reset-password/a2t-reset-password.component';
import { A2tUpdatePasswordComponent } from './a2t-update-password/a2t-update-password.component';
var routes = [{
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
export var a2tRoutes = RouterModule.forChild(routes);
//# sourceMappingURL=a2t-ui.routes.js.map