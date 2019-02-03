import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularTokenService } from '../../../../projects/angular-token/src/public_api';

@Component({
  selector: 'app-access-resource',
  templateUrl: 'access-resource.component.html'
})
export class AccessResourceComponent {

  output: any;

  constructor(
    private tokenService: AngularTokenService,
    private http: HttpClient
  ) { }

  // Submit Data to Backend
  onSubmit() {

    this.output = null;

    this.http.get(this.tokenService.tokenOptions.apiBase + '/private_resource').subscribe(
      res => this.output      = res,
      error => this.output    = error
    );
  }
}
