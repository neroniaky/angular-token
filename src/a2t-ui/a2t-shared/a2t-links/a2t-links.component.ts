import { Component, Input } from '@angular/core';

@Component({
    selector:   'a2t-links',
    template: `
        <div class="a2t-wrapper">
            <p><a routerLink="/session/reset-password" *ngIf="case != 'reset-password'">Forgot Password?</a></p>
            <p><a routerLink="/session/sign-up" *ngIf="case != 'sign-up'">Sign Up</a></p>
            <p><a routerLink="/session/sign-in" *ngIf="case != 'sign-in'">Sign In</a></p>
        </div>
    `,
    styles: [`
        .a2t-wrapper {
            margin-top: 20px;
        }

        p {
            margin-bottom: 0;
        }

        a {
            color: #eee !important;
            transition: .3s;
            text-decoration: none;
            font-size: 15px;
            font-weight: 300;
            font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        }

        a:hover {
            color: white;
        }
    `]
})
export class A2tLinksComponent {

    @Input() case: string;

    constructor() { }
}