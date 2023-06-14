import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

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
