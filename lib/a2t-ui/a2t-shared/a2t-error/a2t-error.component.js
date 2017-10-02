"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var A2tErrorComponent = (function () {
    function A2tErrorComponent() {
    }
    A2tErrorComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'a2t-error',
                    template: '<div *ngFor="let error of errors"><p>{{error}}</p></div>',
                    styles: ["\n        div {\n            width: 100%;\n            background-color: #df6564;\n            color: white;\n            font-weight: 300;\n            font-size: 15px;\n            padding: 10px 20px;\n            border-radius: 3px;\n            margin-bottom: 15px;\n        }\n\n        div > p {\n            margin-bottom: 0;\n        }\n    "]
                },] },
    ];
    /** @nocollapse */
    A2tErrorComponent.ctorParameters = function () { return []; };
    A2tErrorComponent.propDecorators = {
        'errors': [{ type: core_1.Input },],
    };
    return A2tErrorComponent;
}());
exports.A2tErrorComponent = A2tErrorComponent;
//# sourceMappingURL=a2t-error.component.js.map