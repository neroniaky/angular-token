import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-access-resource',
  templateUrl: 'access-resource.component.html'
})
export class AccessResourceComponent {

  output: any;

  constructor(private http: HttpClient) { }

  // Submit Data to Backend
  onSubmit() {

    this.output = null;

    this.http.get('http://localhost:3000/private_resource').subscribe(
      res => this.output      = res,
      error => this.output    = error
    );
  }
}
