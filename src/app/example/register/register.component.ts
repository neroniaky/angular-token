import { Component } from '@angular/core';
import { AngularTokenService, RegisterData } from '../../../../projects/angular-token/src/public_api';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  registerData: RegisterData = <RegisterData>{};
  output: any;

  constructor(private tokenService: AngularTokenService) { }

  // Submit Data to Backend
  onSubmit() {

    this.output = null;

    this.tokenService.registerAccount(this.registerData).subscribe(
      res => {
        this.registerData  = <RegisterData>{};
        this.output        = res;
      }, error => {
        this.registerData  = <RegisterData>{};
        this.output        = error;
      }
    );
  }
}
