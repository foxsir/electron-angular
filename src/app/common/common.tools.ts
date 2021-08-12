import * as md5 from "blueimp-md5";
import * as uuid from "uuid";
import * as OSS from "ali-oss";

export default class CommonTools {
  public static md5(str: string): string {
    return md5(str);
  }

  public static getFileExt(type: string) {
    switch (type) {
      case "image/png":
        return "png";
      case "image/jpg":
        return "jpg";
      case "image/jpeg":
        return "jpeg";
    }
  }

  /**
   * 创建消息指纹
   */
  public static fingerPrint(): string {
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
      const reader = new FileReader();
      reader.addEventListener('load', (event) =>  {
        const blob = new Blob([event.target.result], {
          type: file.type,
        });
        resolve(window.URL.createObjectURL(blob));
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
}
