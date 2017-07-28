import { Component } from '@angular/core';
var A2tUiComponent = (function () {
    function A2tUiComponent() {
    }
    return A2tUiComponent;
}());
export { A2tUiComponent };
A2tUiComponent.decorators = [
    { type: Component, args: [{
                selector: 'a2t-ui',
                template: "\n        <div class=\"a2t-wrapper\">\n            <div class=\"a2t-container\">\n                <router-outlet></router-outlet>\n            </div>\n        </div>\n    ",
                styles: ["\n        .a2t-wrapper {\n            width: 100%;\n            height: 100vh;\n            min-height: 500px;\n\n            padding-top: 100px;\n\n            display: flex;\n            justify-content: center;\n\n            background-color: #3270a0;\n        }\n\n        .a2t-logo {\n            text-align: center;\n            color: white;\n            font-size: 30px;\n        }\n\n        .a2t-container {\n            width: 400px;\n        }\n    "]
            },] },
];
/** @nocollapse */
A2tUiComponent.ctorParameters = function () { return []; };
//# sourceMappingURL=a2t-ui.component.js.map