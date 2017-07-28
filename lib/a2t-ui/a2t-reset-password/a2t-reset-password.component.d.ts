import { Angular2TokenService } from '../../angular2-token.service';
import { A2tFormService } from '../a2t-shared';
export declare class A2tResetPasswordComponent {
    private _formService;
    private _sessionService;
    _emailSend: boolean;
    constructor(_formService: A2tFormService, _sessionService: Angular2TokenService);
    private _handleSuccess();
    private _handleError();
}
