import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UploadFileComponent} from './upload-file/upload-file.component';
import {NzUploadModule} from "ng-zorro-antd/upload";
import {MatProgressBarModule} from "@angular/material/progress-bar";


@NgModule({
  declarations: [
    UploadFileComponent
  ],
  imports: [
    CommonModule,
    NzUploadModule,
    MatProgressBarModule
  ],
  exports: [
    UploadFileComponent
  ]
})
export class UploadModule {
}
