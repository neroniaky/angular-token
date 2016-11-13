import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2TokenService } from '../../angular2-token.service';

import { RegisterData } from '../../angular2-token.model';

import { 
    A2tFormService,
    SIGN_UP_FORM
} from '../';

@Component({
    selector: 'a2t-sign-up',
    templateUrl: 'a2t-sign-up.component.html',
    providers: [A2tFormService]
})
export class A2tSignUpComponent {

    private _errors: string[];

    constructor(
        private _formService: A2tFormService,
        private _sessionService: Angular2TokenService,
        private _router: Router
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
