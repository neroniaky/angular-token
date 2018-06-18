import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularTokenModule } from 'angular-token';

import { AppComponent } from './app.component';
import { ExampleModule } from './example/example.module';
import { RestrictedModule } from './restricted/restricted.module';
import { routes } from './app.routes';

@NgModule({
  imports: [
    routes,
    BrowserModule,
    HttpClientModule,

    ExampleModule,
    RestrictedModule,

    AngularTokenModule.forRoot({
      apiPath: 'http://localhost:3000',
    })
  ],
  providers: [
    AngularTokenModule
  ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
