import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { Angular2TokenService } from '../angular2-token.service';

import { A2tSharedModule } from './a2t-shared/a2t-shared.module';
import { a2tRoutes } from './a2t-ui.routes';
import { A2tUiComponent } from './a2t-ui.component';
import { A2tSignInComponent } from './a2t-sign-in/a2t-sign-in.component';
import { A2tSignUpComponent } from './a2t-sign-up/a2t-sign-up.component';
import { A2tResetPasswordComponent } from './a2t-reset-password/a2t-reset-password.component';
import { A2tUpdatePasswordComponent } from './a2t-update-password/a2t-update-password.component';

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