import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // array in local storage for registered users
    let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

    // wrap in delayed observable to simulate server api call
    return of(null).pipe(mergeMap(() => {

      // Register
      if (request.url === 'http://localhost:3000/auth' && request.method === 'POST') {

        // get new user object from post body
        const body = request.body;

        // Check if all inputs provided
        if (body.email === null && body.password === null && body.password_confirmation === null) {
          return of(this.registerError(body.email));
        }

        // Check if password matches password confimation
        if (body.password !== body.password_confirmation) {

          const mybody = {
            status: 'error',
            data: {
              id: null,
              provider: 'email',
              uid: '',
              name: null,
              nickname: null,
              image: null,
              email: "test@test.de",
              created_at: null,
              updated_at: null
            }
          }

          return of(new HttpResponse({ status: 422 , body: mybody }));
        }

        // Check if login is email
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(body.email)) {
          return of(this.registerError(body.email));
        }

        console.log("test");


        // Check if login already exists
        let duplicateUser = users.filter(user => { return user.email === body.email; }).length;
        if (duplicateUser) {
          return of(this.registerError(body.email));
        }

        const newUser = {
          uid: body.email,
          id: users.length + 1,
          email: body.email,
          provider: "email",
          name: null,
          nickname: null,
          image: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        // respond 200 OK
        return of(new HttpResponse({ body: newUser, status: 200 }));
      }

        /*
        // authenticate
        if (request.url.match('http://localhost:3000/auth') && request.method === 'POST') {
            // find if any user matches login credentials
            let filteredUsers = users.filter(user => {
                return user.username === request.body.username && user.password === request.body.password;
            });

            if (filteredUsers.length) {
                // if login details are valid return 200 OK with user details and fake jwt token
                let user = filteredUsers[0];
                let body = {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: 'fake-jwt-token'
                };

                return of(new HttpResponse({ status: 200, body: body }));
            } else {
                // else return 400 bad request
                return throwError({ error: { message: 'Username or password is incorrect' } });
            }
        }

        // get users
        if (request.url.endsWith('/users') && request.method === 'GET') {
            // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
            if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                return of(new HttpResponse({ status: 200, body: users }));
            } else {
                // return 401 not authorised if token is null or invalid
                return throwError({ error: { message: 'Unauthorised' } });
            }
        }

        // get user by id
        if (request.url.match(/\/users\/\d+$/) && request.method === 'GET') {
            // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
            if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                // find user by id in users array
                let urlParts = request.url.split('/');
                let id = parseInt(urlParts[urlParts.length - 1]);
                let matchedUsers = users.filter(user => { return user.id === id; });
                let user = matchedUsers.length ? matchedUsers[0] : null;

                return of(new HttpResponse({ status: 200, body: user }));
            } else {
                // return 401 not authorised if token is null or invalid
                return throwError({ error: { message: 'Unauthorised' } });
            }
        }
*/

/*
        // delete user
        if (request.url.match(/\/users\/\d+$/) && request.method === 'DELETE') {
            // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
            if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                // find user by id in users array
                let urlParts = request.url.split('/');
                let id = parseInt(urlParts[urlParts.length - 1]);
                for (let i = 0; i < users.length; i++) {
                    let user = users[i];
                    if (user.id === id) {
                        // delete user
                        users.splice(i, 1);
                        localStorage.setItem('users', JSON.stringify(users));
                        break;
                    }
                }

                // respond 200 OK
                return of(new HttpResponse({ status: 200 }));
            } else {
                // return 401 not authorised if token is null or invalid
                return throwError({ error: { message: 'Unauthorised' } });
            }
        }*/

        // pass through any requests not handled above
        return next.handle(request);
        
    }))

    // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
    .pipe(materialize())
    .pipe(delay(500))
    .pipe(dematerialize());
  }

  registerError(email: string) {
    return new HttpResponse({ status: 422 , body: {
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
      /*errors: {
        password_confirmation: [
          "doesn't match Password"
        ],
        email: [
            "is not an email"
        ],
        full_messages: [
            "Password confirmation doesn't match Password",
            "Email is not an email"
        ]
      }*/
    }});
  }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};