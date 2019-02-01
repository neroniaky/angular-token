import { Component, Input } from '@angular/core';

import { AuthResponse } from './auth.model';

@Component({
  selector: 'app-output',
  templateUrl: 'output.component.html',
  styleUrls: ['output.component.scss']
})
export class OutputComponent {

  output: AuthResponse = <AuthResponse>{};

  @Input()
  set data(res: AuthResponse) {

    this.output = <AuthResponse>{};

    if (res != null) {
      this.output.status = res.statusText + ' (' + res.status + ')';

      if (res.errors != null) {
        if (res.errors.full_messages != null) {
          this.output.errors = res.errors.full_messages;
        } else {
          this.output.errors = res.errors;
        }
      } else {
        this.output.data   = res.data;
      }
    }
  }
}
