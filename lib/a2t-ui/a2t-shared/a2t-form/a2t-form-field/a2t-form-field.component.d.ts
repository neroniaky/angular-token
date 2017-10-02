import { OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { BaseField } from '../../../a2t-ui.forms';
export declare class A2tFormFieldComponent implements OnInit {
    question: BaseField;
    form: FormGroup;
    _control: AbstractControl;
    ngOnInit(): void;
    readonly isValid: boolean;
}
