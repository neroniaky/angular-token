import { Router } from '@angular/router';
import { Angular2TokenService } from '../../angular2-token.service';
import { A2tFormService } from '../a2t-shared';
export declare class A2tUpdatePasswordComponent {
    _formService: A2tFormService;
    _sessionService: Angular2TokenService;
    _router: Router;
    _errors: string[];
    constructor(_formService: A2tFormService, _sessionService: Angular2TokenService, _router: Router);
    private _handleSuccess(data);
    private _handleError(error);
}
