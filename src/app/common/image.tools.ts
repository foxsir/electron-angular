import {AppConfig} from '@app/config/config';
import {HttpService} from "../services/http/http.service";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {throwError} from "rxjs";

export class ImageTools {
  private appConfig = AppConfig;

  // cover(cover: string) {
  //   if (cover && cover.length) {
  //     return [this.appConfig.ossUrl, cover.trim() + "?x-oss-process=style/book-cover"].join("/");
  //   } else {
  //     return this.appConfig.defaultCover;
  //   }
  // }

  avatar(user_uid: string, defaultAvatar: boolean = false) {
    if (defaultAvatar) {
      return [
        this.appConfig.ossUrl,
        "UserAvatarDownloader?action=ad&enforceDawnload=1&one_pixel_transparent_if_no=1&user_uid=" + user_uid
      ].join("/");
    } else {
      return this.appConfig.defaultLocalAvatar;
    }
  }

  image(image: string, user_uid: string = null) {
    if (image && image.length) {
      return [this.appConfig.ossUrl, "BinaryDownloader?action=image_d&file_name=" + image.trim(), "&need_dump=0"].join("/");
    } else {
      return this.appConfig.defaultCover;
    }
  }
}
