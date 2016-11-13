import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2TokenService } from '../../angular2-token.service';

import { SignInData } from '../../angular2-token.model';

import { 
    A2tFormService,
    SIGN_IN_FORM
} from '../';

@Component({
    selector: 'a2t-sign-in',
    templateUrl: 'a2t-sign-in.component.html',
    providers: [A2tFormService]
})
export class A2tSignInComponent {

    private _errors: string[];

    constructor(
        private _formService: A2tFormService,
        private _sessionService: Angular2TokenService,
        private _router: Router
    ) {
        this._formService.initForm(SIGN_IN_FORM);
        this._formService.submit$.subscribe(
            (data: SignInData) => this._sessionService.signIn(data).subscribe(
                (res: any) =>   this._handleSuccess(res),
                (error: any) => this._handleError(error)
            )
        );
    }

    private _handleSuccess(data: any) {
        this._errors = null;
        this._formService.unlockSubmit();
        this._router.navigate(['restricted']);
    }

    private _handleError(error: any) {
        this._errors = error.json().errors;
        this._formService.unlockSubmit();
    }
}
