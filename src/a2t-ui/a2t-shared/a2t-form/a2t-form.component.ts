import { Component }  from '@angular/core';

import {
    A2tFormService,
    A2tFormFieldComponent
} from './';

@Component({
    selector: 'a2t-form',
    templateUrl: 'a2t-form.component.html',
    styleUrls: ['a2t-form.component.css']
})

export class A2tFormComponent {
    constructor(private _formService: A2tFormService) { }
}
