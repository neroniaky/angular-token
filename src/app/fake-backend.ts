import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  users: any[];

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // array in local storage for registered users
    this.users = JSON.parse(localStorage.getItem('users')) || [];

    // wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(() => {

      /*
      *
      * Register
      *
      */

      if (request.url === 'https://mock-api-server/auth' && request.method === 'POST') {

        // Get new user object from post body
        const body = request.body;

        // Check if all inputs provided
        if (body.email === null && body.password === null && body.password_confirmation === null) {
          return of(this.registerError(
            body.email,
            'Please submit proper sign up data in request body.'
          ));
        }

        // Check if password matches password confimation
        if (body.password !== body.password_confirmation) {
          return of(this.registerError(
            body.email,
            { password_confirmation: ['does not match Password'] }
          ));
        }

        // Check if login is email
        const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (!re.test(body.email)) {
          return of(this.registerError(
            body.email,
            { email: ['is not an email'] },
          ));
        }

        // Check if login already exists
        const duplicateUser = this.users.filter(user => {
          return user.email === body.email;
        }).length;

        if (duplicateUser) {
          return of(this.registerError(
            body.email,
            { email: ['has already been taken'] },
          ));
        }

        const newUser = {
          id: this.users.length + 1,
          email: body.email,
          password: body.password
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        // respond 200 OK
        return of(new HttpResponse<any>({
          status: 200,
          url: 'https://mock-api-server/auth',
          body: {
            status: 'success',
            data: {
              uid: body.email,
              id: this.users.length + 1,
              email: body.email,
              provider: 'email',
              name: null,
              nickname: null,
              image: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          }
        }));
      }

      /*
      *
      * Sign In
      *
      */

      if (request.url.match('https://mock-api-server/auth/sign_in') && request.method === 'POST') {

        const filteredUsers = this.users.filter(user => {
          return user.email === request.body.email && user.password === request.body.password;
        });

        if (filteredUsers.length) {
          return of(new HttpResponse<any>({
            headers: this.getHeaders(filteredUsers[0].email),
            status: 200,
            url: 'https://mock-api-server/auth/sign_in',
            body:  {
              data: {
                id: filteredUsers[0].id,
                email: filteredUsers[0].email,
                provider: 'email',
                uid: filteredUsers[0].email,
                name: null,
                nickname: null,
                image: null
              }
            }
          }));
        } else {
          // else return 400 bad request
          return of(new HttpResponse<any>({
            status: 401,
            url: 'https://mock-api-server/auth/sign_in',
            body: {
              status: 'false',
              errors: ['Invalid login credentials. Please try again.']
            }
          }));
        }
      }

      /*
      *
      * Sign Out
      *
      */

      if (request.url.match('https://mock-api-server/auth/sign_out') && request.method === 'DELETE') {
        if (request.headers.get('access-token') === 'fake-access-token') {
          return of(new HttpResponse<any>({
            status: 200,
            url: 'https://mock-api-server/auth/sign_out',
            body: {
              success: true
            }
          }));
        } else {
          return of(new HttpResponse<any>({
            status: 404,
            url: 'https://mock-api-server/auth/sign_out',
            body: {
              status: 'false',
              errors: ['User was not found or was not logged in.']
            }
          }));
        }
      }

      /*
      *
      * Validate Token
      *
      */

      if (request.url.match('https://mock-api-server/auth/validate_token') && request.method === 'GET') {

        const user = this.getAuthUser(request);

        if (user) {
          return of(new HttpResponse<any>({
            headers: this.getHeaders(user.email),
            status: 200,
            url: 'https://mock-api-server/auth/validate_token',
            body: {
              success: true,
              data: {
                id: user.id,
                provider: 'email',
                uid: user.email,
                name: null,
                nickname: null,
                image: null,
                email: user.email
              }
            }
          }));
        } else {
          return of(new HttpResponse<any>({
            status: 401,
            url: 'https://mock-api-server/auth/validate_token',
            body: {
              success: false,
              errors: ['Invalid login credentials']
            }
          }));
        }
      }

      /*
      *
      * Update Password
      *
      */

      if (request.url.match('https://mock-api-server/auth') && request.method === 'PUT') {

        // Check if password matches password confimation
        if (request.body.password !== request.body.password_confirmation) {
          return of(this.registerError(
            request.body.email,
            { password_confirmation: ['does not match Password'] }
          ));
        }

        const user = this.getAuthUser(request);

        if (user && user.password === request.body.password) {

          this.users[(user.id - 1)].password = request.body.password;

          localStorage.setItem('users', JSON.stringify(this.users));

          return of(new HttpResponse<any>({
            headers: this.getHeaders(user.email),
            status: 200,
            url: 'https://mock-api-server/auth',
            body: {
              status: 'success',
              data: {
                id: user.id,
                email: user.email,
                uid: user.email,
                provider: 'email',
                name: null,
                nickname: null,
                image: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }
          }));
        } else {
          return of(new HttpResponse<any>({
            status: 401,
            url: 'https://mock-api-server/auth',
            body: {
              success: false,
              errors: ['Invalid login credentials']
            }
          }));
        }
      }

      /*
      *
      * Access Private Resouce
      *
      */

      if (request.url.match('https://mock-api-server/private_resource') && request.method === 'GET') {

        const user = this.getAuthUser(request);

        if (user) {
          return of(new HttpResponse<any>({
            headers: this.getHeaders(user.email),
            status: 200,
            url: 'https://mock-api-server/auth/private_resource',
            body: {
              data: 'Private Content for ' + user.email
            }
          }));
        } else {
          return of(new HttpResponse<any>({
            status: 401,
            url: 'https://mock-api-server/auth/private_resource',
            body: {
              success: false,
              errors: ['Invalid login credentials']
            }
          }));
        }
      }

      // pass through any requests not handled above
      return next.handle(request);
    }))

    // call materialize and dematerialize to ensure delay even if an
    // error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
    .pipe(materialize())
    .pipe(delay(500))
    .pipe(dematerialize());
  }

  getAuthUser(request: HttpRequest<any>) {
    const filteredUsers = this.users.filter(user => user.email === request.headers.get('uid'));

    if (filteredUsers.length && request.headers.get('access-token') === 'fake-access-token') {
      return filteredUsers[0];
    } else {
      return undefined;
    }
  }

  getHeaders(uid: string): HttpHeaders {
    const timestamp = String(Math.floor(Date.now() / 1000) + 600);

    // if login details are valid return 200 OK with user details and fake jwt token
    return new HttpHeaders({
      'access-token': 'fake-access-token',
      'client': 'fake-client-id',
      'expiry': timestamp,
      'token-type': 'Bearer',
      'uid': uid
    });
  }

  registerError(email: string, errorMsg?: {[key: string]: string[]} | string) {
    return new HttpResponse<any>({
      status: 422, url: 'https://mock-api-server/auth', body: {
        status: 'error',
        data: {
          id: null,
          provider: 'email',
          uid: '',
          name: null,
          nickname: null,
          image: null,
          email: email,
          created_at: null,
          updated_at: null
        },
        errors: errorMsg
      }
    });
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
