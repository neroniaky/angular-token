import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2TokenService } from '../../angular2-token.service';

import { RegisterData } from '../../angular2-token.model';
import { A2tFormService } from '../a2t-shared';
import { SIGN_UP_FORM } from '../';

@Component({
    selector:       'a2t-sign-up',
    providers:      [A2tFormService],
    template: `
        <a2t-headline>Sign Up</a2t-headline>
        <a2t-error [errors]="_errors"></a2t-error>
        <a2t-form>Sign Up</a2t-form>
        <a2t-links case="sign-up"></a2t-links>
    `
})
export class A2tSignUpComponent {

    _errors: string[];

    constructor(
        public _formService: A2tFormService,
        public _sessionService: Angular2TokenService,
        public _router: Router
    ) {
        this._formService.initForm(SIGN_UP_FORM);
        this._formService.submit$.subscribe(
            (data: RegisterData) => this._sessionService.registerAccount(data).subscribe(
                res =>      this._handleSuccess(res),
                error =>    this._handleError(error)
            )
        );
    }

    private _handleSuccess(data: any) {
        this._errors = null;
        this._formService.unlockSubmit();
        this._router.navigate(['restricted']);
    }

    private _handleError(error: any) {
        this._errors = error.json().errors.full_messages;
        this._formService.unlockSubmit();
    }
}
