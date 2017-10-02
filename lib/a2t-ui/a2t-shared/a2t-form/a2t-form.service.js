"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var A2tFormService = (function () {
    function A2tFormService() {
        // Submit Event
        this.submit$ = new core_1.EventEmitter();
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
            group[question.key] = new forms_1.FormControl(null, question.validators);
        });
        this.formGroup = new forms_1.FormGroup(group);
    };
    A2tFormService.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    A2tFormService.ctorParameters = function () { return []; };
    return A2tFormService;
}());
exports.A2tFormService = A2tFormService;
//# sourceMappingURL=a2t-form.service.js.map