import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VirtualScrollComponent } from './virtual-scroll/virtual-scroll.component';



@NgModule({
    declarations: [
        VirtualScrollComponent
    ],
    exports: [
      VirtualScrollComponent
    ],
    imports: [
      CommonModule
    ]
})
export class VirtualScrollModule { }
