import { Component, OnInit } from '@angular/core';

import { AngularTokenService } from 'angular-token';

@Component({
  selector: 'app-sign-in-oauth',
  templateUrl: 'sign-in-oauth.component.html'
})
export class SignInOAuthComponent {

  output: any;

  constructor(private tokenService: AngularTokenService) { }

  // Submit Data to Backend
  onSubmit() {

    this.output = null;

    this.tokenService.signInOAuth('github');
  }
}
