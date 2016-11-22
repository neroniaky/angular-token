import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Angular2TokenService } from '../angular2-token.service';

import {
    a2tRoutes,
    A2tUiComponent,
    A2tSharedModule,
} from './';

export { A2tSignInComponent } from './a2t-sign-in/a2t-sign-in.component';
export { A2tSignUpComponent } from './a2t-sign-up/a2t-sign-up.component';
export { A2tResetPasswordComponent } from './a2t-reset-password/a2t-reset-password.component';
export { A2tUpdatePasswordComponent } from './a2t-update-password/a2t-update-password.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        A2tSharedModule,
        a2tRoutes
    ],
    declarations: [
        A2tUiComponent,
        A2tSignInComponent,
        A2tSignUpComponent,
        A2tResetPasswordComponent,
        A2tUpdatePasswordComponent
    ]
})
export class A2tUiModule { }