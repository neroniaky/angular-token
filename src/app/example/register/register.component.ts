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

  @ViewChild('registerForm') registerForm: NgForm;

  registerData: RegisterData = <RegisterData>{};
  output: ApiResponse;

  constructor(private tokenService: AngularTokenService) { }

  // Submit Data to Backend
  onSubmit() {

    this.output = null;

    this.tokenService.registerAccount(this.registerData).subscribe(
      res => {
        this.registerForm.resetForm();
        this.output = res;
      }, error => {
        this.registerForm.resetForm();
        this.output = error;
      }
    );
  }
}
