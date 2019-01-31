import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpInterceptor, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AngularTokenService } from './angular-token.service';

@Injectable()
export class AngularTokenInterceptor implements HttpInterceptor {

  constructor( private tokenService: AngularTokenService ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Skip header add if request is not going to apiBase Server
    if (
      this.tokenService.options.value.apiBase !== null &&
      req.url.match(this.tokenService.options.value.apiBase) === null
    ) {
      return next.handle(req);
    }

    // Add the headers if request is not going to apiBase Server

    const authData = this.tokenService.authData.value;

    if (authData) {
      const headers = {
        'access-token': authData.accessToken,
        'client':       authData.client,
        'expiry':       authData.expiry,
        'token-type':   authData.tokenType,
        'uid':          authData.uid
      };

      req = req.clone({
        setHeaders: headers
      });
    }

    return next.handle(req).pipe(tap(
      res => this.handleResponse(res),
      err => this.handleResponse(err)
    ));
  }

  // Parse Auth data from response
  private handleResponse(res: any): void {
    if (res instanceof HttpResponse || res instanceof HttpErrorResponse) {
      this.tokenService.getAuthHeadersFromResponse(<any>res);
    }
  }
}
