import { Injectable } from '@angular/core';
import * as OSS from "ali-oss";
import OssConfig from "@services/file/config/OssConfig";
import DirectoryType from "@services/file/config/DirectoryType";

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

  constructor() { }

  // Buffer/Blob/File
  upload(buffer: Buffer, fileType: string): Promise<OSS.PutObjectResult> {
    if (Object.values(DirectoryType).includes(fileType)) {
      return this.client.put('message_file/my-obj.png', buffer);
    } else {
      throw new Error([fileType, "未知的文件类型"].join(": "));
    }
  }

  getFile(fileName: string): Promise<OSS.GetObjectResult> {
    return this.client.get(fileName);
  }

}

//
// this.client.list(null, {timeout: 3000}).then((result) => {
//   console.log('objects: %j', result.objects);
//   return this.client.put('message_file/my-obj.txt', Buffer.from("你好", "utf-8"));
// }).then((result) => {
//   console.log('put result: %j', result);
//   return this.client.get('message_file/my-obj.txt');
// }).then((result) => {
//   console.log('get result: %j', result.content.toString());
// });
