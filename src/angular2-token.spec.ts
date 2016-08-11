import { Http, BaseRequestOptions, Response, ResponseOptions, Headers } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { provide } from '@angular/core';
import { inject, addProviders } from '@angular/core/testing';

import { Angular2TokenService } from './';

describe('Angular2TokenService', () => {

	// Init common test data
	let tokenType = 'Bearer';
	let uid = 'test@test.com';
	let accessToken = 'fJypB1ugmWHJfW6CELNfug';
	let client = '5dayGs4hWTi4eKwSifu_mg';
	let expiry = '1472108318';

	let emptyHeaders = new Headers({
		'content-Type': 'application/json'
	});
	let tokenHeaders = new Headers({
		'content-Type': 'application/json',
		'token-type': tokenType,
		'uid': uid,
		'access-token': accessToken,
		'client': client,
		'expiry': expiry
	});

	beforeEach(() => {
		// Inject HTTP and Angular2TokenService
		addProviders([
			BaseRequestOptions,
			MockBackend,
			provide(Http, {
				useFactory:
				function (backend, defaultOptions) {
					return new Http(backend, defaultOptions);
				},
				deps: [MockBackend, BaseRequestOptions]
			}),
			Angular2TokenService
		]);

		// Fake Local Storage
		var store = {};

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

	it('logIn method should send data', inject([Angular2TokenService, MockBackend], (tokenService, mockBackend) => {

		let logInData = {
			email: 'test@test.de',
			password: 'password'
		}

		mockBackend.connections.subscribe(
			c => expect(c.request.getBody()).toEqual(JSON.stringify(logInData))
		);

		tokenService.init();
		tokenService.logIn(logInData.email, logInData.password);
	}));

	it('logIn method should receive headers and set local storage', inject([Angular2TokenService, MockBackend], (tokenService, mockBackend) => {

		let logInData = {
			email: 'test@test.de',
			password: 'password'
		}

		mockBackend.connections.subscribe(
			c => c.mockRespond(new Response(
				new ResponseOptions({
					headers: tokenHeaders
				})
			))
		);

		tokenService.init();
		tokenService.logIn(logInData.email, logInData.password);

		expect(localStorage.getItem('accessToken')).toEqual(accessToken);
		expect(localStorage.getItem('client')).toEqual(client);
		expect(localStorage.getItem('expiry')).toEqual(expiry);
		expect(localStorage.getItem('tokenType')).toEqual(tokenType);
		expect(localStorage.getItem('uid')).toEqual(uid);
	}));

});