import { HttpClientModule, HttpRequest, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AngularTokenModule, AngularTokenService, SignInData, RegisterData } from 'angular-token';

describe('Angular2TokenService', () => {

  // Init common test data
  const tokenType   = 'Bearer';
  const uid         = 'test@test.com';
  const accessToken = 'fJypB1ugmWHJfW6CELNfug';
  const client      = '5dayGs4hWTi4eKwSifu_mg';
  const expiry      = '1472108318';

  const emptyHeaders = {
    'content-Type': 'application/json'
  };

  const tokenHeaders = {
    'content-Type': 'application/json',
    'token-type': tokenType,
    'uid': uid,
    'access-token': accessToken,
    'client': client,
    'expiry': expiry
  };

  const signInData: SignInData = {
    login: 'test@test.de',
    password: 'password'
  };

  const registerData: RegisterData = {
    login: 'test@test.de',
    password: 'password',
    passwordConfirmation: 'password'
  };

  let service: AngularTokenService;
  let backend: HttpTestingController;

  class Mock { }

  beforeEach(() => {
    // Inject HTTP and Angular2TokenService
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        AngularTokenModule.forRoot({})
      ],
      providers: [
        AngularTokenService
      ]
    });

    service = TestBed.get(AngularTokenService);
    backend = TestBed.get(HttpTestingController);

    // Fake Local Storage
    let store = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string): String => {
      return store[key] || null;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string): void => {
      delete store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string): string => {
      return store[key] = <string>value;
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      store = {};
    });
  });

  afterEach(() => {
    backend.verify();
  });

  // Testing Default Configuration

  it('signIn method should post data to default url', () => {

    service.signIn(signInData);

    const req = backend.expectOne({
      url: 'auth/sign_in',
      method: 'POST'
    });

    expect(req.request.body).toEqual(JSON.stringify(signInData));
  });

  /*
  it('signOut method should delete to default url', () => {

    service.signOut();

    backend.expectOne({
      url: 'auth/sign_out',
      method: 'DELETE'
    });
  });

  it('registerAccount should post data to default url', () => {

    service.registerAccount(registerData);

    const req = backend.expectOne({
      url: 'auth',
      method: 'POST'
    });

    expect(req.request.body).toEqual(JSON.stringify({
      login: 					'test@test.de',
      password:				'password',
      password_confirmation:	'password',
      confirm_success_url: 	window.location.href
    }));
  });

  // Testing Custom Configuration

  it('Methods should send to configured path', () => {

    mockBackend.connections.subscribe(
      c => expect(c.request.url).toEqual('myapi/myauth/mysignin')
    );

    tokenService.init({ apiPath: 'myapi', signInPath: 'myauth/mysignin' });
    tokenService.signIn(signInData.login, signInData.password);
  }));

  it('signOut should send to configured path', () => {

    mockBackend.connections.subscribe(
      c => expect(c.request.url).toEqual('myapi/myauth/mysignout')
    );

    tokenService.init({ apiPath: 'myapi', signOutPath: 'myauth/mysignout' });
    tokenService.signOut();
  }));

  it('registerAccount should send to configured path', () => {

    mockBackend.connections.subscribe(
      c => expect(c.request.url).toEqual('myapi/myauth/myregister')
    );

    tokenService.init({ apiPath: 'myapi', registerAccountPath: 'myauth/myregister' });
    tokenService.registerAccount(registerData);
  }));

  it('deleteAccount should send to configured path', () => {

    mockBackend.connections.subscribe(
      c => expect(c.request.url).toEqual('myapi/myauth/mydelete')
    );

    tokenService.init({ apiPath: 'myapi', deleteAccountPath: 'myauth/mydelete' });
    tokenService.deleteAccount();
  }));

  it('validateToken should send to configured path', () => {

    mockBackend.connections.subscribe(
      c => expect(c.request.url).toEqual('myapi/myauth/myvalidate')
    );

    tokenService.init({ apiPath: 'myapi', validateTokenPath: 'myauth/myvalidate' });
    tokenService.validateToken();
  }));

  it('validateToken should call signOut when it returns status 401', () => {

    mockBackend.connections.subscribe(
      c => c.mockError(new Response(new ResponseOptions({ status: 401, headers: new Headers() })))
    );

    spyOn(tokenService, 'signOut');

    tokenService.init({ apiPath: 'myapi', signOutFailedValidate: true });
    tokenService.validateToken().subscribe(res => null, err => expect(tokenService.signOut).toHaveBeenCalled());
  }));

  it('validateToken should not call signOut when it returns status 401', () => {

    mockBackend.connections.subscribe(
      c => c.mockError(new Response(new ResponseOptions({ status: 401, headers: new Headers() })))
    );

    spyOn(tokenService, 'signOut');

    tokenService.init({ apiPath: 'myapi', signOutFailedValidate: false });
    tokenService.validateToken().subscribe(res => null, err => expect(tokenService.signOut).not.toHaveBeenCalled());
  }));

  it('updatePasswordPath should send to configured path', inject([Angular2TokenService, MockBackend], (tokenService, mockBackend) => {

    mockBackend.connections.subscribe(
      c => expect(c.request.url).toEqual('myapi/myauth/myupdate')
    );

    tokenService.init({ apiPath: 'myapi', updatePasswordPath: 'myauth/myupdate' });
    tokenService.updatePassword('password', 'password');
  }));

  it('resetPasswordPath should send to configured path', inject([Angular2TokenService, MockBackend], (tokenService, mockBackend) => {

    mockBackend.connections.subscribe(
      c => expect(c.request.url).toEqual('myapi/myauth/myreset')
    );

    tokenService.init({ apiPath: 'myapi', resetPasswordPath: 'myauth/myreset' });
    tokenService.resetPassword('emxaple@example.org');
  }));


  it('signIn method should use custom loginField', inject([Angular2TokenService, MockBackend], (tokenService, mockBackend) => {

    mockBackend.connections.subscribe(
      c => {
        expect(c.request.getBody()).toEqual(JSON.stringify({"username":"test@test.de","password":"password"}));
        expect(c.request.method).toEqual(RequestMethod.Post);
        expect(c.request.url).toEqual('auth/sign_in');
      }
    );

    tokenService.init({ loginField: 'username' });
    tokenService.signIn(signInData);
  }));


  // Testing Token handling

  it('signIn method should receive headers and set local storage', () => {


    const req = backend.expectOne({
      url: 'auth',
      method: 'POST' }
    );

    expect(req.request.body).toEqual(JSON.stringify({
      login: 					'test@test.de',
      password:				'password',
      password_confirmation:	'password',
      confirm_success_url: 	window.location.href
    }));

    mockBackend.connections.subscribe(
      c => c.mockRespond(new Response(
        new ResponseOptions({
          headers: tokenHeaders,
          body: { login: 'test@email.com' }
        })
      ))
    );

    tokenService.signIn(signInData.login, signInData.password);

    expect(localStorage.getItem('accessToken')).toEqual(accessToken);
    expect(localStorage.getItem('client')).toEqual(client);
    expect(localStorage.getItem('expiry')).toEqual(expiry);
    expect(localStorage.getItem('tokenType')).toEqual(tokenType);
    expect(localStorage.getItem('uid')).toEqual(uid);
  });

  it('signOut method should clear local storage', inject([Angular2TokenService, MockBackend], (tokenService, mockBackend) => {
    localStorage.setItem('token-type', tokenType);
    localStorage.setItem('uid', uid);
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('client', client);
    localStorage.setItem('expiry', expiry);

    mockBackend.connections.subscribe(
      c => expect(c.request.method).toEqual(RequestMethod.Delete)
    );

    tokenService.init();
    tokenService.signOut();

    expect(localStorage.getItem('accessToken')).toBe(null);
    expect(localStorage.getItem('client')).toBe(null);
    expect(localStorage.getItem('expiry')).toBe(null);
    expect(localStorage.getItem('tokenType')).toBe(null);
    expect(localStorage.getItem('uid')).toBe(null);
  }));
*/
});
