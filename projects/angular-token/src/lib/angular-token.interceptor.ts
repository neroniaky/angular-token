import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpInterceptor, HttpHandler } from '@angular/common/http';

import { AngularTokenOptions } from './angular-token.model';
import { AngularTokenService } from './angular-token.service';

import { Observable } from 'rxjs';

@Injectable()
export class AngularTokenInterceptor implements HttpInterceptor {
  private atOptions: AngularTokenOptions;

  constructor( private _tokenService: AngularTokenService ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const baseHeaders: { [key: string]: string; } = this._tokenService.baseHeaders;

    // Get auth data from local storage
    this._tokenService.getAuthDataFromStorage();

    // Add the headers if the request is going to the configured server
    if (this._tokenService.currentAuthData !== null && req.url.match(this._tokenService.apiPath)) {
      (<any>Object).assign(baseHeaders, {
        'access-token': this._tokenService.currentAuthData.accessToken,
        'client':       this._tokenService.currentAuthData.client,
        'expiry':       this._tokenService.currentAuthData.expiry,
        'token-type':   this._tokenService.currentAuthData.tokenType,
        'uid':          this._tokenService.currentAuthData.uid
      });
    }

    req = req.clone({
      setHeaders: baseHeaders
    });

    return next.handle(req);
  }
}
