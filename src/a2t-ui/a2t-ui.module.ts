import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Angular2TokenService } from '../angular2-token.service';

import {
    a2tRoutes,

    A2tUiComponent,
    A2tSharedModule,

    A2tSignInComponent,
    A2tSignUpComponent,
    A2tResetPasswordComponent,
    A2tUpdatePasswordComponent
} from './';

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