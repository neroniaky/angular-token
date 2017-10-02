"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var A2tLinksComponent = (function () {
    function A2tLinksComponent() {
    }
    A2tLinksComponent.decorators = [
        { type: core_1.Component, args: [{
                    selector: 'a2t-links',
                    template: "\n        <div class=\"a2t-wrapper\">\n            <p><a routerLink=\"/session/reset-password\" *ngIf=\"case != 'reset-password'\">Forgot Password?</a></p>\n            <p><a routerLink=\"/session/sign-up\" *ngIf=\"case != 'sign-up'\">Sign Up</a></p>\n            <p><a routerLink=\"/session/sign-in\" *ngIf=\"case != 'sign-in'\">Sign In</a></p>\n        </div>\n    ",
                    styles: ["\n        .a2t-wrapper {\n            margin-top: 20px;\n        }\n\n        p {\n            margin-bottom: 0;\n        }\n\n        a {\n            color: #eee !important;\n            transition: .3s;\n            text-decoration: none;\n            font-size: 15px;\n            font-weight: 300;\n            font-family: \"Segoe UI\", \"Helvetica Neue\", Arial, sans-serif;\n        }\n\n        a:hover {\n            color: white;\n        }\n    "]
                },] },
    ];
    /** @nocollapse */
    A2tLinksComponent.ctorParameters = function () { return []; };
    A2tLinksComponent.propDecorators = {
        'case': [{ type: core_1.Input },],
    };
    return A2tLinksComponent;
}());
exports.A2tLinksComponent = A2tLinksComponent;
//# sourceMappingURL=a2t-links.component.js.map