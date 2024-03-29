import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import {RouterModule} from "@angular/router";
import { ShortDatePipe } from './pipes/';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, ShortDatePipe],
  imports: [CommonModule, TranslateModule, FormsModule, RouterModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, ShortDatePipe]
})
export class SharedModule {}
