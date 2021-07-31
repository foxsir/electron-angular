import {Component, Input, OnInit} from '@angular/core';
import { Observable, Observer } from 'rxjs';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';

import uploadIcon from "./upload-icon";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import uploadOptions from "../uploadOptions";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  loading = false;
  avatarUrl?: string;

  @Input() options: Partial<uploadOptions>;

  public defaultOptions: uploadOptions = {
    size: {width: '100px'},
    icon: this.dom.bypassSecurityTrustResourceUrl(uploadIcon),
    showProgress: true,
  };

  constructor(
    private msg: NzMessageService,
    private dom: DomSanitizer,
  ) {
  }

  ngOnInit(): void {
    this.defaultOptions = Object.assign(this.defaultOptions, this.options);
    if (typeof this.defaultOptions.icon === 'string') {
      this.defaultOptions.icon = this.dom.bypassSecurityTrustResourceUrl(this.defaultOptions.icon);
    }
  }

  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) =>
    new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.msg.error('You can only upload JPG file!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('Image must smaller than 2MB!');
        observer.complete();
        return;
      }
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }

}
