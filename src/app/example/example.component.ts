import { Component, OnInit } from '@angular/core';

import { AngularTokenService } from 'angular-token';

@Component({
  selector: 'app-example',
  templateUrl: 'example.component.html',
  styleUrls: ['example.component.scss']
})
export class ExampleComponent {

  constructor(public tokenService: AngularTokenService) { }
}
