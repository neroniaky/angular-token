import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { RestrictedComponent } from './restricted.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule
  ],
  declarations: [
    RestrictedComponent
  ],
  exports: [
    RestrictedComponent
  ]
})
export class RestrictedModule { }
