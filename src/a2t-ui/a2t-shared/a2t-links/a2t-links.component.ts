import { Component, Input } from '@angular/core';

@Component({
    selector: 'a2t-links',
    templateUrl: 'a2t-links.component.html',
    styleUrls: ['a2t-links.component.css']
})
export class A2tLinksComponent {

    @Input() case: string;

    constructor() { }
}