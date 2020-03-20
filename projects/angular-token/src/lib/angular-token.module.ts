import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { AngularTokenInterceptor } from './angular-token.interceptor';
import { AngularTokenOptions } from './angular-token.model';
import { ANGULAR_TOKEN_OPTIONS } from './angular-token.token';

export * from './angular-token.service';

@NgModule()
export class AngularTokenModule {

  constructor(@Optional() @SkipSelf() parentModule: AngularTokenModule) {
    if (parentModule) {
      throw new Error('AngularToken is already loaded. It should only be imported in your application\'s main module.');
    }
  }
  static forRoot(options: AngularTokenOptions): ModuleWithProviders<AngularTokenModule> {
    return {
      ngModule: AngularTokenModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AngularTokenInterceptor,
          multi: true
        },
        options.angularTokenOptionsProvider ||
        {
          provide: ANGULAR_TOKEN_OPTIONS,
          useValue: options
        }
      ]
    };
  }
}
