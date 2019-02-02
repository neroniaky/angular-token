import { Component, Input } from '@angular/core';
import { ApiResponse} from '../../../../projects/angular-token/src/public_api';

@Component({
  selector: 'app-output',
  templateUrl: 'output.component.html',
  styleUrls: ['output.component.scss']
})
export class OutputComponent {
  @Input() response: ApiResponse;
}
