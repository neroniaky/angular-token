import { Injectable, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
var A2tFormService = (function () {
    function A2tFormService() {
        // Submit Event
        this.submit$ = new EventEmitter();
        this.submitLock = false;
    }
    A2tFormService.prototype.initForm = function (fields) {
        this.fields = fields;
        this._createFormGroup();
    };
    A2tFormService.prototype.submit = function () {
        this.submitLock = true;
        this.submit$.emit(this.formGroup.value);
    };
    A2tFormService.prototype.unlockSubmit = function () {
        this.formGroup.reset();
        this.submitLock = false;
    };
    ;
    A2tFormService.prototype._createFormGroup = function () {
        var group = {};
        this.fields.forEach(function (question) {
            group[question.key] = new FormControl(null, question.validators);
        });
        this.formGroup = new FormGroup(group);
    };
    return A2tFormService;
}());
export { A2tFormService };
A2tFormService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
A2tFormService.ctorParameters = function () { return []; };
//# sourceMappingURL=a2t-form.service.js.map