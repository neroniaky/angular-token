import { Component, Input } from '@angular/core';
import { Angular2TokenService } from '../../angular2-token.service';

import { ResetPasswordData } from '../../angular2-token.model';
import { A2tFormService } from '../a2t-shared';
import { RESET_PASSWORD_FORM } from '../';

@Component({
    selector:       'a2t-reset-password',
    providers:      [A2tFormService],
    template: `
        <a2t-headline *ngIf="!_emailSend">Reset your Password</a2t-headline>
        <a2t-form *ngIf="!_emailSend">Reset Password</a2t-form>
        <p class="email-send-text" *ngIf="_emailSend">
            If the entered email is registered we will send instruction on how to reset your password.
        </p>
        <a2t-links *ngIf="!_emailSend" case="reset-password"></a2t-links>
    `,
    styles: [`
        .email-send-text {
            background-color: #72c380;
            color: white;
            font-size: 16pt;
            text-align: center;
            padding: 20px;
            border-radius: 3px;
        }
    `]
})
export class A2tResetPasswordComponent {

    _emailSend: boolean = false;

    constructor(
        private _formService: A2tFormService,
        private _sessionService: Angular2TokenService
    ) {
        this._formService.initForm(RESET_PASSWORD_FORM);
        this._formService.submit$.subscribe(
            (data: ResetPasswordData) => this._sessionService.resetPassword(data).subscribe(
                res =>      this._handleSuccess(),
                error =>    this._handleError()
            )
        );
    }

    private _handleSuccess() {
        this._emailSend = true;
    }

    private _handleError() {
        this._emailSend = true;
    }
}
