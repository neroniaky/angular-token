import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RestrictedComponent } from './restricted.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    RestrictedComponent
  ],
  exports: [
    RestrictedComponent
  ]
})
export class RestrictedModule { }
