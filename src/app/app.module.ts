import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatToolbarModule } from '@angular/material/toolbar';

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
      // Change to your local dev environment example: 'http://localhost:3000'
      apiBase: 'https://mock-api-server',
    }),

    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule
  ],
  providers: [
    fakeBackendProvider
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
