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
   * 获取时间戳：秒
   */
  public static getTime(): number {
    return (new Date()).getTime() / 1000;
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

  /**
   * 毫秒
   */
  public static getTimestamp(): number {
    return new Date().getTime();
  }

  //毫秒时间戳转汉化日期时间
  public static formatSecondToChinese(s: number):string{
    var theTime = Math.ceil(s/1000);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    var theDay = 0; //天
    // alert(theTime);
    if(theTime > 60) {
      theTime1 = Math.floor(theTime/60);
      theTime = Math.floor(theTime%60);
      if(theTime1 > 60) {
        theTime2 = Math.floor(theTime1/60);
        theTime1 = Math.floor(theTime1%60);
      }
      console.dir(theTime2)
      if(theTime2 > 24){
        theDay = Math.floor(theTime2/24);
        theTime2 = Math.floor(theTime2%24);
      }
      console.dir(theDay)
    }
    var result = "";
    if(theTime1 > 0) {
      result = ""+Math.floor(theTime1)+"分钟"+result;
    }
    if(theTime2 > 0) {
      result = ""+Math.floor(theTime2)+"小时"+result;
    }
    if(theDay > 0) {
      result = ""+Math.floor(theDay)+"天"+result;
    }

    return result;
  }

  //将时间戳转换成正常时间格式
  public static timestampToDateTime(timestamp,isSeconds) {
    var date = new Date(timestamp * (isSeconds?1000:1));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
  }

}
