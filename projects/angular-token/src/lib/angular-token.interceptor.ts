import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpInterceptor, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { AngularTokenOptions } from './angular-token.model';
import { AngularTokenService } from './angular-token.service';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AngularTokenInterceptor implements HttpInterceptor {
  private atOptions: AngularTokenOptions;

  constructor( private tokenService: AngularTokenService ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const baseHeaders: { [key: string]: string; } = Object.assign({}, this.tokenService.baseHeaders);

    // Get auth data from local storage
    this.tokenService.getAuthDataFromStorage();

    // Add the headers if the request is going to the configured server
    if (this.tokenService.currentAuthData && req.url.match(this.tokenService.apiPath)) {
      (<any>Object).assign(baseHeaders, {
        'access-token': this.tokenService.currentAuthData.accessToken,
        'client':       this.tokenService.currentAuthData.client,
        'expiry':       this.tokenService.currentAuthData.expiry,
        'token-type':   this.tokenService.currentAuthData.tokenType,
        'uid':          this.tokenService.currentAuthData.uid
      });
    }

    req = req.clone({
      setHeaders: baseHeaders
    });

    return next.handle(req).pipe(tap(
        res => this.handleResponse(res),
        err => this.handleResponse(err)
    ));
  }


  // Parse Auth data from response
  private handleResponse(res: any): void {
    if ((res instanceof HttpResponse || res instanceof HttpErrorResponse) && res.url.match(this.tokenService.apiPath)) {
        this.tokenService.getAuthHeadersFromResponse(<any>res);
    }
  }
}
