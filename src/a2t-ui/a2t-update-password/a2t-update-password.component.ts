import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2TokenService } from '../../angular2-token.service';

import { UpdatePasswordData } from '../../angular2-token.model';
import { A2tFormService } from '../a2t-shared';
import { UPDATE_PASSWORD_FORM } from '../';

@Component({
    selector:   'a2t-update-password',
    providers:  [A2tFormService],
    template: `
        <a2t-headline>Update your Password</a2t-headline>
        <a2t-error [errors]="_errors"></a2t-error>
        <a2t-form>Update Password</a2t-form>
    `
})
export class A2tUpdatePasswordComponent {

    _errors: string[];

    constructor(
        public _formService: A2tFormService,
        public _sessionService: Angular2TokenService,
        public _router: Router
    ) {
        this._formService.initForm(UPDATE_PASSWORD_FORM);
        this._formService.submit$.subscribe(
            (data: UpdatePasswordData) => this._sessionService.updatePassword(data).subscribe(
                res =>      this._handleSuccess(res),
                error =>    this._handleError(error)
            )
        );
    }

    private _handleSuccess(data: any) {
        this._router.navigate(['session/sign-in']);
    }

    private _handleError(error: any) {
        this._errors = error.json().errors;
        this._formService.unlockSubmit();
    }
}
