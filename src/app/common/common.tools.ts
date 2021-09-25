import * as md5 from "blueimp-md5";
import * as uuid from "uuid";
import * as OSS from "ali-oss";
import {MimetypesList} from "@app/common/TypeList";
import filesize from "@app/common/filesize";

export default class CommonTools {
  public static md5(str: string): string {
    return md5(str);
  }

  public static getFileExt(filename: string, type: string): string {
    const ext = MimetypesList[type];
    if(typeof ext === 'string') {
      return ext;
    } else {
      return filename.split(".").pop();
    }
  }

  /**
   * 创建uuid
   */
  public static uuid(): string {
    return uuid.v1();
  }

  /**
   * 获取时间戳
   */
  public static getTime(): number {
    return (new Date()).getTime();
  }

  public static getBlobUrlFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      CommonTools.getBlobFromFile(file).then(blob => {
        resolve(window.URL.createObjectURL(blob));
      });
    });
  }

  public static getBlobFromFile(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', (event) =>  {
        const blob = new Blob([event.target.result], {
          type: file.type,
        });
        resolve(blob);
      });

      reader.readAsArrayBuffer(file);
    });
  }

  public static getBlobUrlFromOSSRes(res: OSS.GetObjectResult): string {
    const blob = new Blob([res.content], {
      type: res.res.headers["content-type"],
    });
    return window.URL.createObjectURL(blob);
  }

  public static downloadLink(link: string, name: string) {
    const alink = document.createElement("a");
    alink.download = name;
    alink.href = link;
    alink.click();
    setTimeout(function() {
      return window.URL.revokeObjectURL(alink.href);
    }, 1000);
  }

  public static formatFileSize(length: number): string {
    return filesize(length);
  }
}
