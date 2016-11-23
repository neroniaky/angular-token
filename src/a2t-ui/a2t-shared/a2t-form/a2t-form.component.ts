import { Component }  from '@angular/core';

import { A2tFormService } from './a2t-form.service';
import { A2tFormFieldComponent } from './a2t-form-field/a2t-form-field.component';

@Component({
    selector: 'a2t-form',
    templateUrl: 'a2t-form.component.html',
    styleUrls: ['a2t-form.component.css']
})

export class A2tFormComponent {
    constructor(private _formService: A2tFormService) { }
}
