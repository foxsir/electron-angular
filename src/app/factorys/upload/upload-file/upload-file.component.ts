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

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  @Input() showText: string;
  loading = false;
  fileUrl?: string;

  @Input() options: Partial<uploadOptions>;
  @Output() fileUploaded = new EventEmitter<URL>();
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

      this.loading = true;
      this.getBuffer(file).then(buffer => {
        let filename = CommonTools.md5([file.name, file.lastModified].join("-"));
        filename = [filename, CommonTools.getFileExt(file.type)].join(".");

        this.fileService.upload(buffer, filename, DirectoryType.OSS_FILE).then(res => {
          this.fileUploaded.emit(new URL(res.url));
          this.loading = false;
          this.fileUrl = res.url;
        });
      });
      // alert(file.type);
      // alert(file.size);
      // alert(file.name);
      // alert(file.path);
      // observer.next(isJpgOrPng && isLt2M);
      //
      // console.dir(observer.complete());

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
