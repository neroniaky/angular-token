import { Component, Input } from '@angular/core';
import { Angular2TokenService } from '../angular2-token.service';

@Component({
    selector:   'a2t-ui',
    template: `
        <div class="a2t-wrapper">
            <div class="a2t-container">
                <router-outlet></router-outlet>
            </div>
        </div>
    `,
    styles: [`
        .a2t-wrapper {
            width: 100%;
            height: 100vh;
            min-height: 500px;

            padding-top: 100px;

            display: flex;
            justify-content: center;

            background-color: #3270a0;
        }

        .a2t-logo {
            text-align: center;
            color: white;
            font-size: 30px;
        }

        .a2t-container {
            width: 400px;
        }
    `]
})
export class A2tUiComponent {
    constructor() { }
}
