import { Component } from '@angular/core';

@Component({
    selector:   'a2t-headline',
    template:   '<p><ng-content></ng-content></p>',
    styles:  [`
        p {
            text-align: center;
            color: white;
            font-size: 30px;
        }
    `]
})
export class A2tHeadlineComponent {
    constructor() { }
}