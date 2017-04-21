import { Component, Input } from '@angular/core';

@Component({
    selector:   'a2t-error',
    template:   '<div *ngFor="let error of errors"><p>{{error}}</p></div>',
    styles: [`
        div {
            width: 100%;
            background-color: #df6564;
            color: white;
            font-weight: 300;
            font-size: 15px;
            padding: 10px 20px;
            border-radius: 3px;
            margin-bottom: 15px;
        }

        div > p {
            margin-bottom: 0;
        }
    `]
})
export class A2tErrorComponent {

    @Input() errors: string[];

    constructor() { }
}
