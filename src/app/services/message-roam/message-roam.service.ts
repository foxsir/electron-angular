import { Injectable } from '@angular/core';
import {_HTTP_SERVER_URL} from "@app/config/post-api";
import {HttpService} from "@services/http/http.service";
import {ImService} from "@services/im/im.service";
import {CacheService} from "@services/cache/cache.service";

class GroupHistoryOptions {
  gid: number;
  type: number = 0;
  from: number;
  to: number;
  page: number = 0;
  pageSize: number = 50;
}

class FriendHistoryOptions {
  from: string;
  myuid: number;
  page: number;
  pageSize: number = 30;
  to: number;
  type: number;
  uid: number;
}

class AllLastMessageOptions {
  myuid: number;
}

@Injectable({
  providedIn: 'root'
})
export class MessageRoamService {
  constructor(
    private http: HttpService,
    private imService: ImService,
    private cacheService: CacheService,
  ) { }


  private SERVER_URL: string = _HTTP_SERVER_URL;
  private groupHistoryApi = [this.SERVER_URL, "v1/chat/group-his"].join("/");
  private friendHistoryApi = [this.SERVER_URL, "v1/chat/friend-his"].join("/");
  private allLastMessageApi = [this.SERVER_URL, "v1/chat/last-msg"].join("/");

  /**
   * 获取群聊历史消息
   * example: /v1/chat/group-his?gid=0000000214&type=0&from=0&to=0&page=0&pageSize=50
   */
  getGroupHistory(options: GroupHistoryOptions) {
    options = Object.assign(options, new GroupHistoryOptions());
    return this.http.get(this.groupHistoryApi, options);
  }

  /**
   * 获取个人聊天历史消息
   * example: /v1/chat/friend-his?from=71f163ea-20c4-4816-9dda-78336a95b048&myuid=400071&page=0&pageSize=30&to=0&type=0&uid=400221
   */
  getFriendHistory(options: FriendHistoryOptions) {
    options = Object.assign(options, new FriendHistoryOptions());
    return this.http.get(this.friendHistoryApi, options);
  }

  /**
   * 获取全部会话的最近一条聊天记录
   * example: v1/chat/last-msg?myuid=400071
   */
  getAllLastMessage() {
    const options: AllLastMessageOptions = {
      myuid: Number(this.imService.getLoginInfo().loginUserId),
    };
    return this.http.get(this.allLastMessageApi, options);
  }

}
