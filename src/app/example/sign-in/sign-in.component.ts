import { Component } from '@angular/core';
import { AngularTokenService, SignInData } from 'projects/angular-token/src/public_api';

@Component({
  selector: 'app-sign-in',
  templateUrl: 'sign-in.component.html'
})
export class SignInComponent {

  signInData: SignInData = <SignInData>{};
  output: any;

  constructor(private tokenService: AngularTokenService) { }

  // Submit Data to Backend
  onSubmit() {

    this.output = null;

    this.tokenService.signIn(this.signInData).subscribe(
      res => {
        this.signInData     = <SignInData>{};
        this.output         = res;
      }, error => {
        this.signInData     = <SignInData>{};
        this.output         = error;
      }
    );
  }
}
