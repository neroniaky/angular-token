"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var router_1 = require("@angular/router");
var a2t_form_1 = require("./a2t-form");
var a2t_links_component_1 = require("./a2t-links/a2t-links.component");
var a2t_error_component_1 = require("./a2t-error/a2t-error.component");
var a2t_headline_component_1 = require("./a2t-headline/a2t-headline.component");
var A2tSharedModule = (function () {
    function A2tSharedModule() {
    }
    A2tSharedModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule,
                        forms_1.ReactiveFormsModule,
                        router_1.RouterModule
                    ],
                    declarations: [
                        a2t_form_1.A2tFormFieldComponent,
                        a2t_form_1.A2tFormComponent,
                        a2t_links_component_1.A2tLinksComponent,
                        a2t_error_component_1.A2tErrorComponent,
                        a2t_headline_component_1.A2tHeadlineComponent
                    ],
                    exports: [
                        a2t_form_1.A2tFormComponent,
                        a2t_links_component_1.A2tLinksComponent,
                        a2t_error_component_1.A2tErrorComponent,
                        a2t_headline_component_1.A2tHeadlineComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    A2tSharedModule.ctorParameters = function () { return []; };
    return A2tSharedModule;
}());
exports.A2tSharedModule = A2tSharedModule;
//# sourceMappingURL=a2t-shared.module.js.map