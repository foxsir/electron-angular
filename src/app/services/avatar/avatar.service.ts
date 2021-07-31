import { Injectable } from '@angular/core';
import {HttpService} from "@services/http/http.service";
import {ImageTools} from "@app/common/image.tools";
import {AppConfig} from "@app/config/config";
import * as localforage from "localforage";

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private appConfig = AppConfig;
  private imageTools = new ImageTools();
  public defaultLocalAvatar = this.appConfig.defaultLocalAvatar;

  constructor(
    private http: HttpService
  ) {
  }

  /**
   * 获取用户头像，返回用户设置的或默认头像，并缓存到 indexedDB
   * @param user_uid
   */
  getAvatar(user_uid: string): Promise<any> {
    const url = this.imageTools.avatar(user_uid);
    return new Promise((resolve, reject) => {

      localforage.getItem("avatarMap").then(data => {
        if (data !== null && !!data[user_uid]) {
          resolve(data[user_uid]);
        } else {
          this.http.getContentLength(url).then(length => {
            if (Number(length) === 0) {
              resolve(this.defaultLocalAvatar);
            } else {
              resolve(url);
              return this.updateAvatarCacheBase64(url, user_uid);
            }
          });
        }
      });
    });
  }

  /**
   * 更新用户头像缓存
   * @param url
   * @param user_uid
   */
  public async updateAvatarCacheBase64(url: string, user_uid: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
      const base64data = reader.result;
      localforage.getItem("avatarMap").then(data => {
        if (data === null) {
          localforage.setItem("avatarMap", {[user_uid]: base64data});
        } else {
          localforage.setItem("avatarMap", Object.assign(data, {[user_uid]: base64data}));
        }
      });
    };
  }
}
