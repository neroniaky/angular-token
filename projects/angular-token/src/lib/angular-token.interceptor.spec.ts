import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { AngularTokenModule } from './angular-token.module';
import { AngularTokenService } from './angular-token.service';

describe('AngularTokenInterceptor', () => {

  // Init common test data
  const tokenType   = 'Bearer';
  const uid         = 'test@test.com';
  const accessToken = 'fJypB1ugmWHJfW6CELNfug';
  const client      = '5dayGs4hWTi4eKwSifu_mg';
  const expiry      = '1472108318';

  let service: AngularTokenService;
  let backend: HttpTestingController;

  function initService(serviceConfig) {
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

    service = TestBed.get(AngularTokenService);
    backend = TestBed.get(HttpTestingController);
  }

  beforeEach(() => {
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

  /**
   *
   * Test Http Interceptor
   *
   */

  describe('http interceptor', () => {

    describe('with apiBase', () => {
      beforeEach(() => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('client', client);
        localStorage.setItem('expiry', expiry);
        localStorage.setItem('tokenType', tokenType);
        localStorage.setItem('uid', uid);

        initService({
          apiBase: 'http://localhost'
        });
      });

      it('should add authorization headers when to same domain', inject([HttpClient], (http: HttpClient) => {
        const testUrl = 'http://localhost/random-endpoint';

        http.get(testUrl).subscribe(response => expect(response).toBeTruthy());

        const req = backend.expectOne({
            url: testUrl,
            method: 'GET'
        });
        req.flush({data: 'test'});

        expect(req.request.headers.get('access-token')).toBe(accessToken);
        expect(req.request.headers.get('client')).toBe(client);
        expect(req.request.headers.get('expiry')).toBe(expiry);
        expect(req.request.headers.get('token-type')).toBe(tokenType);
        expect(req.request.headers.get('uid')).toBe(uid);
      }));

      it('should not add authorization headers when to different domain', inject([HttpClient], (http: HttpClient) => {
        const testUrl = 'http://not-local-host/random-endpoint';

        http.get(testUrl).subscribe(response => expect(response).toBeTruthy());

        const req = backend.expectOne({
          url: testUrl,
          method: 'GET'
        });
        req.flush({data: 'test'});

        expect(req.request.headers.get('access-token')).toBeNull();
        expect(req.request.headers.get('client')).toBeNull();
        expect(req.request.headers.get('expiry')).toBeNull();
        expect(req.request.headers.get('token-type')).toBeNull();
        expect(req.request.headers.get('uid')).toBeNull();
      }));

    });

    describe('without apiBase', () => {
      beforeEach(() => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('client', client);
        localStorage.setItem('expiry', expiry);
        localStorage.setItem('tokenType', tokenType);
        localStorage.setItem('uid', uid);

        initService({});
      });

      it('should add authorization headers', inject([HttpClient], (http: HttpClient) => {
        const testUrl = 'http://localhost/random-endpoint';

        http.get(testUrl).subscribe(response => expect(response).toBeTruthy());

        const req = backend.expectOne({
          url: testUrl,
          method: 'GET'
        });
        req.flush({data: 'test'});

        expect(req.request.headers.get('access-token')).toBe(accessToken);
        expect(req.request.headers.get('client')).toBe(client);
        expect(req.request.headers.get('expiry')).toBe(expiry);
        expect(req.request.headers.get('token-type')).toBe(tokenType);
        expect(req.request.headers.get('uid')).toBe(uid);
      }));
    });

    describe('handleResponse', () => {
      beforeEach(() => {
        initService({});
      });

      it('should handle headers from a request', inject([HttpClient], (http: HttpClient) => {
        const testUrl = 'http://localhost/random-endpoint';

        http.get(testUrl).subscribe(response => expect(response).toBeTruthy());

        const req = backend.expectOne({
          url: testUrl,
          method: 'GET'
        });
        req.flush({data: 'test'}, {
          headers: {
            'access-token': accessToken,
            'client': client,
            'expiry': expiry,
            'token-type': tokenType,
            'uid': uid
          }
        });

        expect(localStorage.getItem('accessToken')).toBe(accessToken);
        expect(localStorage.getItem('client')).toBe(client);
        expect(localStorage.getItem('expiry')).toBe(expiry);
        expect(localStorage.getItem('tokenType')).toBe(tokenType);
        expect(localStorage.getItem('uid')).toBe(uid);
      }));
    });
  });
});
