import { Component }  from '@angular/core';

import { A2tFormService } from './a2t-form.service';
import { A2tFormFieldComponent } from './a2t-form-field/a2t-form-field.component';

@Component({
    selector: 'a2t-form',
    template: `
        <form class="a2t-form"
            (ngSubmit)="_formService.submit()"
            [formGroup]="_formService.formGroup">

            <a2t-form-field
                *ngFor="let field of this._formService.fields"
                [question]="field"
                [form]="_formService.formGroup">
            </a2t-form-field>

            <button type="submit" [disabled]="!_formService.formGroup.valid || _formService.formGroup.pristine || _formService.submitLock">
                <ng-content *ngIf="!_formService.submitLock"></ng-content>
                <span *ngIf="_formService.submitLock">Submitting ...</span>
            </button>
        </form>
    `,
    styles: [`
        .a2t-form {
            background-color: white;
            border-radius: 3px;
            box-shadow: 0px 1px 5px 0 rgba(0,0,0,0.3);
            padding-top: 20px;
            font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        }

        .a2t-form button {
            width: 100%;

            transition: .3s;
            background-color: #72c380;

            border-bottom-right-radius: 3px;
            border-bottom-left-radius: 3px;

            outline: none;
            text-align: center;
            font-weight: 400;
            border: none;
            font-size: 16px;
            line-height: 30px;

            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
            color: white;
            border-bottom: 3px solid transparent;
        }

        .a2t-form button:disabled {
            background-color: #eee !important;
            cursor: not-allowed;
            color: #999;
            text-shadow: none;
        }

        .a2t-form button:hover {
            background-color: #a6d9ae;
        }
    `]
})

export class A2tFormComponent {
    constructor(private _formService: A2tFormService) { }
}
