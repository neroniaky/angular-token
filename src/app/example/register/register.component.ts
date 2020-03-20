import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  AngularTokenService,
  RegisterData,
  ApiResponse
} from '../../../../projects/angular-token/src/public_api';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  @ViewChild('registerForm', { static: true }) registerForm: NgForm;

  registerData: RegisterData = <RegisterData>{};
  output: ApiResponse;

  constructor(private tokenService: AngularTokenService) { }

  // Submit Data to Backend
  onSubmit() {

    this.output = null;

    this.tokenService.registerAccount(this.registerData).subscribe(
      res => {
        this.output = res;
        this.registerForm.resetForm();
      }, error => {
        this.output = error;
        this.registerForm.resetForm();
      }
    );
  }
}
