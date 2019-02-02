import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { MatIconModule } from '@angular/material/icon';

import { ExampleComponent } from './example.component';
import { OutputComponent } from './output/output.component';
import { RegisterComponent } from './register/register.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AccessResourceComponent } from './access-resource/access-resource.component';
import { ValidateTokenComponent } from './validate-token/validate-token.component';
import { SignOutComponent } from './sign-out/sign-out.component';
import { CanActivateComponent } from './can-activate/can-activate.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule
  ],
  declarations: [
    ExampleComponent,
    OutputComponent,
    RegisterComponent,
    SignInComponent,
    ChangePasswordComponent,
    SignOutComponent,
    AccessResourceComponent,
    ValidateTokenComponent,
    CanActivateComponent
  ],
  exports: [
    ExampleComponent
  ]
})
export class ExampleModule { }
