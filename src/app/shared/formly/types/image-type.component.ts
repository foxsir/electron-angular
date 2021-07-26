import {Component, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {FieldType} from '@ngx-formly/material';
import {MatInput} from '@angular/material/input';
import {Observable} from 'rxjs';
import {startWith, switchMap} from 'rxjs/operators';
import {AppConfig} from '@app/config/config';

import {APP_CONFIG as environment} from "environments/environment";
import {NzUploadFile} from 'ng-zorro-antd/upload';
import {SnackBarService} from '@services/snack-bar/snack-bar.service';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'upload-image',
  template: `
        <div fxFlex>
          <div fxLayout="row" fxLayoutAlign="center">
            <mat-card [fxFlex]="to.attributes?.width || '300px'" class="mat-elevation-z0">
              <img *ngIf="fileList.length === 0" mat-card-image src="/assets/images/image.svg" alt="">
              <div *ngFor="let img of fileList">
                <img mat-card-image src="{{img.url}}" alt="">
                <button type="button"
                        mat-icon-button
                        (click)="handleRemove(img)"
                        style="position: absolute; right: 8px; top: 8px;">
                  <mat-icon color="accent">clear</mat-icon>
                </button>
              </div>
              <mat-card-actions>
                <nz-upload
                  [nzAction]="environment.uploadFileAPI"
                  [nzHeaders]="{ Authorization: Authorization }"
                  nzListType="picture-card"
                  [(nzFileList)]="fileList"
                  [nzShowButton]="fileList.length < 2"
                  [nzDisabled]="loading"
                  [nzShowUploadList]="false"
                  [nzPreview]="handlePreview"
                  [nzRemove]="handleRemove"
                  (nzChange)="handleChange($event)">
                  <button type="button" mat-button fxFlex="100">
                    <mat-icon>insert_photo</mat-icon> 上传图片
                  </button>
                </nz-upload>
              </mat-card-actions>
            </mat-card>
          </div>
        </div>
        <input matInput hidden
               [formControl]="formControl"
               [formlyAttributes]="field"
               [placeholder]="to.placeholder"/>
    `,
})
export class ImageTypeComponent extends FieldType implements OnInit, AfterViewInit {
  // Optional: only if you want to rely on `MatInput` implementation
  @ViewChild(MatInput) formFieldControl: MatInput;
  formControl: FormControl;
  Authorization = null;
  environment = environment;

  fileList: NzUploadFile[] = [];
  loading = false;
  previewImage: string | undefined = '';
  previewVisible = false;

  filter: Observable<any>;

  constructor(
    private snackBar: SnackBarService
  ) {
    super();
    this.Authorization = window.localStorage.getItem('Authorization');
  }

  ngOnInit() {
    super.ngOnInit();
    this.filter = this.formControl.valueChanges
      .pipe(
        startWith(''),
        switchMap(term => this.to.filter(term)),
      );

    this.formControl.valueChanges.subscribe(file => {
      if (this.field.formControl.value !== null && this.field.formControl.value.length && this.fileList.length === 0) {
        this.fileList.push({
          uid: '-1',
          name: this.to.label,
          status: 'done',
          url: [AppConfig.ossUrl, file].join('/'),
        });
      }
    });

    if (this.field.formControl.value !== null && this.field.formControl.value.length) {
      this.fileList.push({
        uid: '-1',
        name: this.to.label,
        status: 'done',
        url: [AppConfig.ossUrl, this.field.formControl.value].join('/'),
      });
    }
  }

  ngAfterViewInit() {
  }

  handlePreview = (file: NzUploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  handleRemove = (file: NzUploadFile): boolean | Observable<boolean> => {
    this.formControl.setValue(null);
    this.fileList[this.fileList.indexOf(file)] = null;
    this.fileList = this.fileList.filter(item => item != null);
    return false;
  };

  handleChange(info: { file: NzUploadFile }): void {
    if (info.file.status === 'uploading') {
      this.loading = true;
      return;
    }

    if (info.file.status === 'done') {
      this.loading = false;
      if (info.file.response.error !== 1) {
        this.formControl.setValue(info.file.response.data.filename);
        this.fileList = [];
        this.fileList.push({
          uid: '-1',
          name: this.to.label,
          status: 'done',
          url: [AppConfig.ossUrl, info.file.response.data.filename].join('/'),
        });
      } else {
        this.snackBar.openSnackBar(info.file.error.error.message, 'mat-warn');
      }
    }

    if (info.file.status === 'error') {
      this.loading = false;
      this.fileList.pop();
      this.snackBar.openSnackBar('图片上传失败:' + info.file.error.error.message, 'mat-warn');
    }
  }

}
