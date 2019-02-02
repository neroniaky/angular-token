import { Component } from '@angular/core';
import { AngularTokenService } from '../../../../projects/angular-token/src/public_api';

@Component({
    selector: 'app-sign-out',
    templateUrl: 'sign-out.component.html'
})
export class SignOutComponent {

  output: any;

  constructor(private tokenService: AngularTokenService) { }

  // Submit Data to Backend
  onSubmit() {

    this.output = null;

    this.tokenService.signOut().subscribe(
      res => this.output      = res,
      error => this.output    = error
    );
  }
}
