import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import {
  AngularTokenService,
  UpdatePasswordData,
  ApiResponse
} from '../../../../projects/angular-token/src/public_api';

@Component({
  selector: 'app-change-password',
  templateUrl: 'change-password.component.html'
})
export class ChangePasswordComponent {

  @ViewChild('changePasswordForm', { static: true }) changePasswordForm: NgForm;

  updatePasswordData: UpdatePasswordData = <UpdatePasswordData>{};
  output: ApiResponse;

  constructor(private tokenService: AngularTokenService) { }

  // Submit Data to Backend
  onSubmit() {

    this.output = null;

    this.tokenService.updatePassword(this.updatePasswordData).subscribe(
      res => {
        this.output = res;
        this.changePasswordForm.resetForm();
      }, error => {
        this.output = error;
        this.changePasswordForm.resetForm();
      }
    );
  }
}
