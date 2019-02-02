import { Component, Input } from '@angular/core';
import { ApiResponse} from 'projects/angular-token/src/public_api';

@Component({
  selector: 'app-output',
  templateUrl: 'output.component.html',
  styleUrls: ['output.component.scss']
})
export class OutputComponent {

  output: ApiResponse = <ApiResponse>{};

  @Input()
  set data(res: ApiResponse) {

    this.output = <ApiResponse>{};

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
