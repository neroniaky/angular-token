import { Component, Input } from '@angular/core';
import { Angular2TokenService } from '../../angular2-token.service';

import { ResetPasswordData } from '../../angular2-token.model';

import {
    A2tFormService,
    RESET_PASSWORD_FORM
} from '../';

@Component({
    selector: 'a2t-reset-password',
    templateUrl: 'a2t-reset-password.component.html',
    styleUrls: ['a2t-reset-password.component.css'],
    providers: [A2tFormService]
})
export class A2tResetPasswordComponent {

    private _emailSend: boolean = false;

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
