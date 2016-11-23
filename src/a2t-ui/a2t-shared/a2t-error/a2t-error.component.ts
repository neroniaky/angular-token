import { Component, Input } from '@angular/core';

@Component({
    selector: 'a2t-error',
    template: '<div *ngFor="let error of errors"><p>{{error}}</p></div>',
    styleUrls: ['a2t-error.component.css']
})
export class A2tErrorComponent {

    @Input() errors: string[];

    constructor() { }
}