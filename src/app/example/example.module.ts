import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ExampleComponent } from './example.component';
import { OutputComponent } from './output/output.component';
import { RegisterComponent } from './register/register.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignInOAuthComponent } from './sign-in-oauth/sign-in-oauth.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AccessResourceComponent } from './access-resource/access-resource.component';
import { ValidateTokenComponent } from './validate-token/validate-token.component';
import { SignOutComponent } from './sign-out/sign-out.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  declarations: [
    ExampleComponent,
    OutputComponent,
    RegisterComponent,
    SignInComponent,
    SignInOAuthComponent,
    ChangePasswordComponent,
    SignOutComponent,
    AccessResourceComponent,
    ValidateTokenComponent
  ],
  exports: [
    ExampleComponent
  ]
})
export class ExampleModule { }
