import { NgModule }     from '@angular/core';
import { ReactiveFormsModule }  from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { A2tFormComponent, A2tFormFieldComponent } from './a2t-form';
import { A2tLinksComponent } from './a2t-links/a2t-links.component';
import { A2tErrorComponent } from './a2t-error/a2t-error.component';
import { A2tHeadlineComponent } from './a2t-headline/a2t-headline.component';

@NgModule({
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
})
export class A2tSharedModule { }
