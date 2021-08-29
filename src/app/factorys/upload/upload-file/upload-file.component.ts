import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable, Observer} from 'rxjs';

import {NzMessageService} from 'ng-zorro-antd/message';
import {NzUploadFile} from 'ng-zorro-antd/upload';

import uploadIcon from "./upload-icon";
import {DomSanitizer} from "@angular/platform-browser";
import uploadOptions from "../uploadOptions";
import {FileService} from "@services/file/file.service";
import DirectoryType from "@services/file/config/DirectoryType";
import CommonTools from "@app/common/common.tools";
import {formatDate} from "@app/libs/mobileimsdk-client-common";
import {LocalUserService} from "@services/local-user/local-user.service";

export type UploadedFile = {
  file: NzUploadFile;
  url: URL;
};

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  @Input() showText: string;
  @Input() fileTypes: string[];
  @Input() directoryType: string;
  loading = false;
  fileUrl?: string;

  @Input() options: Partial<uploadOptions>;
  @Output() fileUploaded = new EventEmitter<UploadedFile>();
  @Output() getFileInfo = new EventEmitter<NzUploadFile>();

  public defaultOptions: uploadOptions = {
    size: {width: '100px'},
    icon: this.dom.bypassSecurityTrustResourceUrl(uploadIcon),
    showProgress: true,
  };

  constructor(
    private msg: NzMessageService,
    private dom: DomSanitizer,
    private fileService: FileService,
    private localUserService: LocalUserService,
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
      this.getFileInfo.emit(file);

      if(this.fileTypes === undefined) {
        this.msg.error("请定义 fileTypes");
        observer.complete();
        return;
      }

      const isJpgOrPng = this.fileTypes.includes(file.type) || this.fileTypes.includes('*');
      if (!isJpgOrPng) {
        this.msg.error(['不允许的文件类型: ', file.type].join(""));
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 100;
      if (!isLt2M) {
        this.msg.error('文件大小不允许超过 100MB!');
        observer.complete();
        return;
      }

      if(Object.values(DirectoryType).includes(this.directoryType) === false) {
        this.msg.error('请使用正确的目录名称，参考：DirectoryType');
        observer.complete();
        return;
      }

      this.loading = true;
      this.getBuffer(file).then(buffer => {
        let filename = CommonTools.md5([file.name, file.lastModified].join("-"));
        // 判断是否是头像
        if(this.directoryType === 'user_portrait') {
          filename = this.localUserService.localUserInfo.userId.toString();
          filename = [filename, CommonTools.getFileExt(file.name, file.type)].join(".");
        } else {
          filename = [filename, CommonTools.getFileExt(file.name, file.type)].join(".");
          filename = [formatDate(new Date().getTime(), 'yyyy-M-d'), filename].join("-");
        }
        this.fileService.upload(buffer, filename, this.directoryType).then(res => {
          this.fileUploaded.emit({
            file: file,
            url: new URL(res.url)
          });
          this.loading = false;
          if([ // 上传为图片时
            DirectoryType.OSS_PORTRAIT,
            DirectoryType.OSS_IMAGE,
            DirectoryType.OSS_PHOTOALBUM
          ].includes(this.directoryType)) {
            this.fileUrl = res.url;
          }
        });
      });
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  private getBuffer(file: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      let binaryString;

      reader.onload = function() {
        const arrayBuffer: ArrayBuffer = this.result as ArrayBuffer;
        const buffer = Buffer.from(arrayBuffer);
        resolve(buffer);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // handleChange(info: { file: NzUploadFile }): void {
  //   switch (info.file.status) {
  //     case 'uploading':
  //       this.loading = true;
  //       break;
  //     case 'done':
  //       this.fileChange.emit("urlurlurl");
  //       // Get this url from response in real world.
  //       this.getBase64(info.file!.originFileObj!, (img: string) => {
  //         this.loading = false;
  //         this.fileUrl = img;
  //       });
  //       break;
  //     case 'error':
  //       this.msg.error('Network error');
  //       this.loading = false;
  //       break;
  //   }
  // }

}
