import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { A2tFormComponent, A2tFormFieldComponent } from './a2t-form';
import { A2tLinksComponent } from './a2t-links/a2t-links.component';
import { A2tErrorComponent } from './a2t-error/a2t-error.component';
import { A2tHeadlineComponent } from './a2t-headline/a2t-headline.component';
var A2tSharedModule = (function () {
    function A2tSharedModule() {
    }
    return A2tSharedModule;
}());
export { A2tSharedModule };
A2tSharedModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    ReactiveFormsModule,
                    RouterModule
                ],
                declarations: [
                    A2tFormFieldComponent,
                    A2tFormComponent,
                    A2tLinksComponent,
                    A2tErrorComponent,
                    A2tHeadlineComponent
                ],
                exports: [
                    A2tFormComponent,
                    A2tLinksComponent,
                    A2tErrorComponent,
                    A2tHeadlineComponent
                ]
            },] },
];
/** @nocollapse */
A2tSharedModule.ctorParameters = function () { return []; };
//# sourceMappingURL=a2t-shared.module.js.map