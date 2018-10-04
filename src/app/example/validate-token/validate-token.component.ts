import { Component } from '@angular/core';
import { AngularTokenService } from '../../../../projects/angular-token/src/public_api';

@Component({
  selector: 'app-validate-token',
  templateUrl: 'validate-token.component.html'
})
export class ValidateTokenComponent {

  output: any;

  constructor(private tokenService: AngularTokenService) { }

  // Submit Data to Backend
  onSubmit() {

    this.output = null;

    this.tokenService.validateToken().subscribe(
      res => this.output     = res,
      error => this.output   = error
    );
  }
}
