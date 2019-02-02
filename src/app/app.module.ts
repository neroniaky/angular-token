import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';

import { AngularTokenModule } from '../../projects/angular-token/src/public_api';

import { AppComponent } from './app.component';
import { ExampleModule } from './example/example.module';
import { RestrictedModule } from './restricted/restricted.module';
import { routes } from './app.routes';
import { fakeBackendProvider } from './fake-backend';




@NgModule({
  imports: [
    routes,
    BrowserModule,
    HttpClientModule,

    ExampleModule,
    RestrictedModule,

    AngularTokenModule.forRoot({
      apiBase: 'http://localhost:3000',
    }),

    BrowserAnimationsModule
  ],
  providers: [
    AngularTokenModule,
    fakeBackendProvider
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
