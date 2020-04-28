import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularTokenService, SignInData, ApiResponse } from '../../../../projects/angular-token/src/public_api';

@Component({
  selector: 'app-sign-in',
  templateUrl: 'sign-in.component.html'
})
export class SignInComponent {

  @ViewChild('signInForm', { static: true }) signInForm: NgForm;

  signInData: SignInData = <SignInData>{};
  output: ApiResponse;

  constructor(private tokenService: AngularTokenService) { }

  // Submit Data to Backend
  onSubmit() {

    this.output = null;

    this.tokenService.signIn(this.signInData).subscribe(
      res => {
        this.output = res;
        this.signInForm.resetForm();
      }, error => {
        this.output = error;
        this.signInForm.resetForm();
      }
    );
  }
}
