import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AngularTokenModule } from './angular-token.module';
import { AngularTokenService } from './angular-token.service';
import {
  SignInData,
  RegisterData,
  UpdatePasswordData,
  ResetPasswordData,
  AuthData,
  UserData,
  AngularTokenOptions
} from './angular-token.model';

describe('AngularTokenService', () => {

  // Init common test data
  const tokenType   = 'Bearer';
  const uid         = 'test@test.com';
  const accessToken = 'fJypB1ugmWHJfW6CELNfug';
  const client      = '5dayGs4hWTi4eKwSifu_mg';
  const expiry      = '1472108318';

  const tokenHeaders = {
    'content-Type': 'application/json',
    'token-type': tokenType,
    'uid': uid,
    'access-token': accessToken,
    'client': client,
    'expiry': expiry
  };

  const authData: AuthData = {
    tokenType: tokenType,
    uid: uid,
    accessToken: accessToken,
    client: client,
    expiry: expiry
  };

  const userData: UserData = {
    id:       1,
    provider: 'provider',
    uid:      'uid',
    name:     'name',
    nickname: 'nickname',
    image:    null,
    login:    'test@test.de'
  };

  // SignIn test data
  const signInData: SignInData = {
    login: 'test@test.de',
    password: 'password'
  };

  const signInDataOutput = {
    email: 'test@test.de',
    password: 'password'
  };

  const signInDataCustomOutput = {
    username: 'test@test.de',
    password: 'password'
  };

  // Register test data
  const registerData: RegisterData = {
    login: 'test@test.de',
    password: 'password',
    passwordConfirmation: 'password'
  };

  // Register test data
  const registerCustomFieldsData: RegisterData = {
    login: 'test@test.de',
    first_name: 'John',
    last_name: 'Doe',
    password: 'password',
    passwordConfirmation: 'password'
  };

  const registerCustomFieldsDataOutput = {
    email: 'test@test.de',
    first_name: 'John',
    last_name: 'Doe',
    password: 'password',
    password_confirmation: 'password',
    confirm_success_url: 	window.location.href
  };

  const registerDataOutput = {
    email: 'test@test.de',
    password: 'password',
    password_confirmation: 'password',
    confirm_success_url: 	window.location.href
  };

  const registerCustomDataOutput = {
    username: 'test@test.de',
    password: 'password',
    password_confirmation: 'password',
    confirm_success_url: 	window.location.href
  };

  // Update password data
  const updatePasswordData: UpdatePasswordData = {
    password: 'newpassword',
    passwordConfirmation: 'newpassword',
    passwordCurrent: 'oldpassword'
  };

  const updatePasswordDataOutput = {
    current_password: 'oldpassword',
    password: 'newpassword',
    password_confirmation: 'newpassword'
  };

  // Reset password data
  const resetPasswordData: ResetPasswordData = {
    login: 'test@test.de',
  };

  const resetPasswordDataOutput = {
    email: 'test@test.de',
    redirect_url: 'http://localhost:9876/context.html'
  };

  const resetCustomPasswordDataOutput = {
    username: 'test@test.de',
    redirect_url: 'http://localhost:9876/context.html'
  };

  let service: AngularTokenService;
  let backend: HttpTestingController;

  function initService(serviceConfig: AngularTokenOptions) {
    // Inject HTTP and AngularTokenService
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        AngularTokenModule.forRoot(serviceConfig)
      ],
      providers: [
        AngularTokenService
      ]
    });

    service = TestBed.inject(AngularTokenService);
    backend = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => {
    // Fake Local Storage
    let store: { [key: string]: string; } = {};
    
    const fakeSessionStorage = {
      setItem: (key: string, value: string) => store[key] = `${value}`,
      getItem: (key: string): string => key in store ? store[key] : null,
      removeItem: (key: string) => delete store[key],
      clear: () => store = {}
    };

    spyOn(Storage.prototype, 'setItem').and.callFake(fakeSessionStorage.setItem);
    spyOn(Storage.prototype, 'getItem').and.callFake(fakeSessionStorage.getItem);
    spyOn(Storage.prototype, 'removeItem').and.callFake(fakeSessionStorage.removeItem);
    spyOn(Storage.prototype, 'clear').and.callFake(fakeSessionStorage.clear);
  });

  afterEach(() => {
    backend.verify();
  });

  /**
   *
   * Test default configuration
   *
   */

  describe('default configuration', () => {
    beforeEach(() => {
      initService({});
    });

    it('signIn should POST data', () => {

      service.signIn(signInData);

      const req = backend.expectOne({
        url: 'auth/sign_in',
        method: 'POST'
      });

      expect(req.request.body).toEqual(signInDataOutput);
    });

    it('signIn method should set local storage', () => {

      service.signIn(signInData).subscribe(data => {
        expect(localStorage.getItem('accessToken')).toEqual(accessToken);
        expect(localStorage.getItem('client')).toEqual(client);
        expect(localStorage.getItem('expiry')).toEqual(expiry);
        expect(localStorage.getItem('tokenType')).toEqual(tokenType);
        expect(localStorage.getItem('uid')).toEqual(uid);
      });

      const req = backend.expectOne({
        url: 'auth/sign_in',
        method: 'POST'
      });

      req.flush(
        { login: 'test@email.com' },
        { headers: tokenHeaders }
      );
    });

    it('signOut should DELETE', () => {

      service.signOut().subscribe();

      backend.expectOne({
        url: 'auth/sign_out',
        method: 'DELETE'
      });

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('client')).toBeNull();
      expect(localStorage.getItem('expiry')).toBeNull();
      expect(localStorage.getItem('tokenType')).toBeNull();
      expect(localStorage.getItem('uid')).toBeNull();
    });


    it('signOut should clear local storage', () => {
      localStorage.setItem('token-type', tokenType);
      localStorage.setItem('uid', uid);
      localStorage.setItem('access-token', accessToken);
      localStorage.setItem('client', client);
      localStorage.setItem('expiry', expiry);

      service.signOut().subscribe( data => {
        expect(localStorage.getItem('accessToken')).toBe(null);
        expect(localStorage.getItem('client')).toBe(null);
        expect(localStorage.getItem('expiry')).toBe(null);
        expect(localStorage.getItem('tokenType')).toBe(null);
        expect(localStorage.getItem('uid')).toBe(null);
      });

      backend.expectOne({
        url: 'auth/sign_out',
        method: 'DELETE'
      });
    });

    describe('registerAccount should POST data', () => {
      it('with standard fields', () => {

        service.registerAccount(registerData).subscribe();

        const req = backend.expectOne({
          url: 'auth',
          method: 'POST'
        });

        expect(req.request.body).toEqual(registerDataOutput);
      });

      it('with custom fields', () => {

        service.registerAccount(registerCustomFieldsData).subscribe();

        const req = backend.expectOne({
          url: 'auth',
          method: 'POST'
        });

        expect(req.request.body).toEqual(registerCustomFieldsDataOutput);
      });

    });

    it('validateToken should GET', () => {

      service.validateToken();

      backend.expectOne({
        url: 'auth/validate_token',
        method: 'GET'
      });
    });

    it('validateToken should not call signOut when it returns status 401', () => {

      const signOutSpy = spyOn(service, 'signOut');

      service.validateToken().subscribe(() => {}, () => expect(signOutSpy).not.toHaveBeenCalled());

      const req = backend.expectOne({
        url: 'auth/validate_token',
        method: 'GET'
      });

      req.flush('',
        {
          status: 401,
          statusText: 'Not authorized'
        }
      );
    });

    it('updatePassword should PUT', () => {

      service.updatePassword(updatePasswordData).subscribe();

      const req = backend.expectOne({
        url: 'auth',
        method: 'PUT'
      });

      expect(req.request.body).toEqual(updatePasswordDataOutput);
    });

    it('resetPassword should POST', () => {

      service.resetPassword(resetPasswordData).subscribe();

      const req = backend.expectOne({
        url: 'auth/password',
        method: 'POST'
      });

      expect(req.request.body).toEqual(resetPasswordDataOutput);
    });

  });

  /**
   *
   * Testing custom configuration
   *
   */

  describe('custom configuration', () => {
    beforeEach(() => {
      initService({
        apiBase: 'https://localhost',
        apiPath: 'myapi',

        signInPath: 'myauth/mysignin',
        signOutPath: 'myauth/mysignout',
        registerAccountPath: 'myauth/myregister',
        deleteAccountPath: 'myauth/mydelete',
        validateTokenPath: 'myauth/myvalidate',
        updatePasswordPath: 'myauth/myupdate',
        resetPasswordPath: 'myauth/myreset',

        loginField: 'username'
      });
    });

    it('signIn should POST data', () => {

      service.signIn(signInData);

      const req = backend.expectOne({
        url: 'https://localhost/myapi/myauth/mysignin',
        method: 'POST'
      });

      expect(req.request.body).toEqual(signInDataCustomOutput);
    });

    it('signOut should DELETE', () => {

      service.signOut().subscribe();

      backend.expectOne({
        url: 'https://localhost/myapi/myauth/mysignout',
        method: 'DELETE'
      });
    });

    it('registerAccount should POST data', () => {

      service.registerAccount(registerData).subscribe();

      const req = backend.expectOne({
        url: 'https://localhost/myapi/myauth/myregister',
        method: 'POST'
      });

      expect(req.request.body).toEqual(registerCustomDataOutput);
    });

    it('validateToken should GET', () => {

      service.validateToken();

      backend.expectOne({
        url: 'https://localhost/myapi/myauth/myvalidate',
        method: 'GET'
      });
    });

    it('updatePassword should PUT', () => {

      service.updatePassword(updatePasswordData).subscribe();

      const req = backend.expectOne({
        url: 'https://localhost/myapi/myauth/myupdate',
        method: 'PUT'
      });

      expect(req.request.body).toEqual(updatePasswordDataOutput);
    });

    it('resetPassword should POST', () => {

      service.resetPassword(resetPasswordData).subscribe();

      const req = backend.expectOne({
        url: 'https://localhost/myapi/myauth/myreset',
        method: 'POST'
      });

      expect(req.request.body).toEqual(resetCustomPasswordDataOutput);
    });

  });

  describe('signoutValidate', () => {
    beforeEach(() => {
      initService({
        signOutFailedValidate: true
      });
    });

    it('validateToken should call signOut when it returns status 401', () => {

      const signOutSpy = spyOn(service, 'signOut');

      service.validateToken().subscribe(() => {}, () => expect(signOutSpy).toHaveBeenCalled() );

      const req = backend.expectOne({
        url: 'auth/validate_token',
        method: 'GET'
      });

      req.flush('',
        {
          status: 401,
          statusText: 'Not authorized'
        }
      );

    });
  });

  describe('user signed out', () => {
    beforeEach(() => {
      initService({});
    });

    it('currentAuthData should return undefined', () => {
      expect(service.currentAuthData).toEqual(null);
    });

    it('currentUserData should return undefined', () => {
      expect(service.currentUserData).toEqual(null);
    });

    it('currentUserType should return undefined', () => {
      expect(service.currentUserType).toEqual(undefined);
    });

    it('userSignedIn should return false', () => {
      expect(service.userSignedIn()).toEqual(false);
    });
  });

  describe('user signed in', () => {
    beforeEach(() => {
      initService({});
    });

    it('currentAuthData should return current auth data', () => {
      service.signIn(signInData).subscribe(
        data => expect(service.currentAuthData).toEqual(authData)
      );

      const req = backend.expectOne({
        url: 'auth/sign_in',
        method: 'POST'
      });

      req.flush( userData, { headers: tokenHeaders } );
    });

    /*it('currentUserData should return current user data', () => {
      service.signIn(signInData).subscribe(
        data => expect(service.currentUserData).toEqual(userData)
      );

      const req = backend.expectOne({
        url: 'auth/sign_in',
        method: 'POST'
      });

      req.flush( userData, { headers: tokenHeaders } );
    });*/

    it('userSignedIn should true', () => {
      service.signIn(signInData).subscribe(
        data => expect(service.userSignedIn()).toEqual(true)
      );

      const req = backend.expectOne({
        url: 'auth/sign_in',
        method: 'POST'
      });

      req.flush( userData, { headers: tokenHeaders } );
    });
  });
});
