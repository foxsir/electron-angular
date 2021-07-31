import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyDataComponent } from './empty-data/empty-data.component';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout';



@NgModule({
  declarations: [EmptyDataComponent],
  exports: [
    EmptyDataComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    FlexLayoutModule
  ]
})
export class EmptyDataModule { }
