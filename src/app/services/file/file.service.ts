import { Injectable } from '@angular/core';
import * as OSS from "ali-oss";
import OssConfig from "@services/file/config/OssConfig";
import DirectoryType from "@services/file/config/DirectoryType";
import CommonTools from "@app/common/common.tools";
import {Subject} from "rxjs";
import {ElectronService} from "@app/core/services";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private readonly client = new OSS({
    region: OssConfig.region,
    accessKeyId: OssConfig.AccessKeyID,
    accessKeySecret: OssConfig.AccessKeySecret,
    bucket: OssConfig.bucketName,
    endpoint: OssConfig.endpoint,
  });

  private amr2mp3Source = new Subject<any>();
  private amr2mp3$ = this.amr2mp3Source.asObservable();

  private listen = false;

  constructor(
    private electronService: ElectronService
  ) {
    if(this.listen !== true) {
      this.listen = true;
      this.listenReply();
    }
  }

  /**
   * 可接受数据类型 Buffer/Blob/File
   * @param buffer
   * @param filename
   * @param fileType
   */
  upload(buffer: Buffer, filename: string, fileType: string): Promise<OSS.PutObjectResult> {
    if (Object.values(DirectoryType).includes(fileType)) {
      return this.client.put([fileType, filename].join("/"), buffer);
    } else {
      throw new Error([fileType, "未知的文件路径类型 请参考：DirectoryType"].join(": "));
    }
  }

  /**
   * 获取文件，fileName：alioss文件路径
   * @param fileName
   */
  getFile(fileName: string): Promise<OSS.GetObjectResult> {
    return this.client.get(fileName);
  }

  /**
   * 获取访问路径
   * @param pathname
   */
  getFileUrl(pathname: string): string {
    return [OssConfig.bucketDomain, '/', pathname].join("").replace('//', '/');
  }

  listenReply() {
    this.electronService.ipcRendererOn('amr2mp3-reply', (event, arg: boolean) => {
      this.amr2mp3Source.next(arg);
    });
  }

  amr2mp3(url) {
    return new Promise((resolve) => {
      const data = {
        url: url,
        uuid: CommonTools.uuid()
      };
      this.electronService.ipcRendererSend('amr2mp3', data);

      const subscribe = this.amr2mp3$.subscribe((res) => {
        if(res.uuid === data.uuid) {
          resolve(res);
          subscribe.unsubscribe();
        }
      });
    });
  }

}
