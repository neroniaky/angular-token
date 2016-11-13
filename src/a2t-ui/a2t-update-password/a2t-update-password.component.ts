import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Angular2TokenService } from '../../angular2-token.service';

import { UpdatePasswordData } from '../../angular2-token.model';

import { 
    A2tFormService,
    UPDATE_PASSWORD_FORM
} from '../';

@Component({
    selector: 'a2t-update-password',
    templateUrl: 'a2t-update-password.component.html',
    providers: [A2tFormService]
})
export class A2tUpdatePasswordComponent {

    private _errors: string[];

    constructor(
        private _formService: A2tFormService,
        private _sessionService: Angular2TokenService,
        private _router: Router
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
