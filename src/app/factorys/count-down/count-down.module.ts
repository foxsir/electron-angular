import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilenceCountDownComponent } from './silence-count-down/silence-count-down.component';
import {FlexLayoutModule} from "@angular/flex-layout";



@NgModule({
    declarations: [
        SilenceCountDownComponent
    ],
    exports: [
        SilenceCountDownComponent
    ],
  imports: [
    CommonModule,
    FlexLayoutModule
  ]
})
export class CountDownModule { }
