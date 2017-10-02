import { EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseField } from '../../a2t-ui.forms';
export declare class A2tFormService {
    submit$: EventEmitter<any>;
    submitLock: boolean;
    formGroup: FormGroup;
    fields: BaseField[];
    constructor();
    initForm(fields: BaseField[]): void;
    submit(): void;
    unlockSubmit(): void;
    private _createFormGroup();
}
