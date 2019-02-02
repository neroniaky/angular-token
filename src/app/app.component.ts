import { Component, ViewEncapsulation } from '@angular/core';

import { AngularTokenService } from '../../projects/angular-token/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(public tokenService: AngularTokenService) { }
}
