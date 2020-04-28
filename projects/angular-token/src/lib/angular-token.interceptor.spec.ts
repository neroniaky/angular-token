import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { AngularTokenModule } from './angular-token.module';
import { AngularTokenService } from './angular-token.service';
import { AngularTokenOptions } from './angular-token.model';

describe('AngularTokenInterceptor', () => {

  // Init common test data
  const tokenType   = 'Bearer';
  const uid         = 'test@test.com';
  const accessToken = 'fJypB1ugmWHJfW6CELNfug';
  const client      = '5dayGs4hWTi4eKwSifu_mg';
  const expiry      = '1472108318';

  // let service: AngularTokenService;
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
