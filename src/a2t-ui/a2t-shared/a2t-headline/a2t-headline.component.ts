import { Component } from '@angular/core';

@Component({
    selector: 'a2t-headline',
    template: '<p><ng-content></ng-content></p>',
    styleUrls: ['a2t-headline.component.css']
})
export class A2tHeadlineComponent {
    constructor() { }
}