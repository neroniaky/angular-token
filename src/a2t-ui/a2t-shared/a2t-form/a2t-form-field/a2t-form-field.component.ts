import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

import { BaseField } from '../../../a2t-ui.forms';

@Component({
    selector:   'a2t-form-field',
    template: `
        <div class="a2t-input-group"
            [formGroup]="form">

            <label
                [attr.for]="question.key"
                [style.color]="labelColor"
                *ngIf="_control.pristine">
                {{question.label}}
            </label>

            <label class="a2t-error"
                [attr.for]="question.key"
                *ngIf="_control.hasError('required') && !_control.pristine">
                {{question.label}} is required
            </label>

            <label class="a2t-error"
                [attr.for]="question.key"
                *ngIf="_control.hasError('minlength')">
                {{question.label}} is too short
            </label>

            <label class="a2t-error"
                [attr.for]="question.key"
                *ngIf="_control.hasError('maxlength')">
                {{question.label}} is too long
            </label>

            <label class="a2t-valid"
                [attr.for]="question.key"
                *ngIf="_control.valid && !_control.pristine">
                {{question.label}}
            </label>

            <input
                [formControlName]="question.key"
                [id]="question.key"
                [type]="question.type">
        </div>
    `,
    styles: [`
        .a2t-input-group {
            padding-bottom: 40px;
            padding-right: 20px;
            padding-left: 20px;
            font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        }

        .a2t-input-group input {
            width: 100%;
            outline: none;
            border: none;
            background-color: #eee;
            line-height: 40px;

            padding-left: 10px;
            padding-right: 10px;
        }

        .a2t-input-group label {
            color: #666;
            font-weight: 600;
            font-size: 13px;
            margin-bottom: 0;
        }

        .a2t-error {
            color: #df6564 !important;
        }

        .a2t-valid {
            color: #72c380 !important;
        }
    `]
})

export class A2tFormFieldComponent implements OnInit {

    @Input() question:  BaseField;
    @Input() form:      FormGroup;

    public _control:   AbstractControl;

    ngOnInit() {
        this._control = this.form.controls[this.question.key];
    }

    get isValid() {
        return this._control.valid;
    }
}
