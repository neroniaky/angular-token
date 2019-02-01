import { Component } from '@angular/core';
import { AngularTokenService } from '../../../projects/angular-token/src/public_api';

@Component({
  selector: 'app-example',
  templateUrl: 'example.component.html',
  styleUrls: ['example.component.scss']
})
export class ExampleComponent {

  constructor(public tokenService: AngularTokenService) { }
}
