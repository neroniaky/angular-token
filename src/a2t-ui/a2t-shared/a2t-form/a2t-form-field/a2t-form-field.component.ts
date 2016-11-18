import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

import { BaseField } from '../../../';

@Component({
    selector:       'a2t-form-field',
    templateUrl:    'a2t-form-field.component.html',
    styleUrls:      ['a2t-form-field.component.css']
})

export class A2tFormFieldComponent implements OnInit {

    @Input() question:  BaseField;
    @Input() form:      FormGroup;

    private _control:   AbstractControl;

    ngOnInit() {
        this._control = this.form.controls[this.question.key];
    }

    get isValid() {
        return this._control.valid;
    }
}
