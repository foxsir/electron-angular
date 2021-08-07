import * as md5 from "blueimp-md5";

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
}
