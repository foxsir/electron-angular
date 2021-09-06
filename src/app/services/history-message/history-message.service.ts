import { Injectable } from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {GetFriendHistory, GetGroupHistory} from "@app/config/post-api";
import {HttpService} from "@services/http/http.service";
import {CacheService} from "@services/cache/cache.service";
import {Observable} from "rxjs";
import {LocalUserService} from "@services/local-user/local-user.service";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";

class QueryFriend {
  from: string = "0";
  myuid: number;
  page: number = 0;
  pageSize: number = 30;
  to: string = "0";
  type: number;
  uid: number;
}

class QueryGroup {
  gid: string;
  type: number;
  from: string = "0";
  to: string = "0";
  page: number = 0;
  pageSize: number = 30;
}

class HistoryData {
  currPage: 1;
  list: string[]; // string = JSON.stringify(ChatmsgEntityModel)
  pageSize: number;
  totalCount: number;
  totalPage: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryMessageService {

  constructor(
    private http: HttpService,
    private cacheService: CacheService,
    private localUserService: LocalUserService,
  ) {

  }

  /**
   * 获取单聊历史消息
   * @param alarmItem
   * @param chat
   * @param position top: 向上拉取 end：向下拉取
   * @param size
   */
  getFriendMessage(
    alarmItem: AlarmItemInterface, chat: ChatmsgEntityModel, position: 'top' | 'end', size?: number
  ): Observable<NewHttpResponseInterface<HistoryData>> {
    const params = new QueryFriend();
    params.page = 0;
    params.pageSize = size || params.pageSize;
    params.type = 0;
    params.uid = Number(alarmItem.alarmItem.dataId);
    params.myuid = this.localUserService.localUserInfo.userId;

    if(position === 'top') {
      // to 以为fingerPrintOfProtocal为基点拉去旧消息
      params.to = chat.fingerPrintOfProtocal;
    } else {
      // from 以为fingerPrintOfProtocal为基点拉去新消息
      delete params.pageSize;
      params.from = chat.fingerPrintOfProtocal; // 开始uuid
      params.to = "09406bb0-0d59-11ec-956b-4f183d390109"; // 最新一条消息uuid
    }

    return this.http.get(GetFriendHistory, params);
  }

  /**
   * 获取群聊历史消息
   * @param alarmItem
   * @param chat
   * @param position top: 向上拉取 end：向下拉取
   * @param size
   */
  getGroupMessage(
    alarmItem: AlarmItemInterface, chat: ChatmsgEntityModel, position: 'top' | 'end', size?: number
  ): Observable<NewHttpResponseInterface<HistoryData>> {
    const params = new QueryGroup();
    params.page = 0;
    params.pageSize = size || params.pageSize;
    params.type = 0;
    params.gid = alarmItem.alarmItem.dataId;

    if(position === 'top') {
      // to 以为fingerPrintOfProtocal为基点拉去旧消息
      params.to = chat.fingerPrintOfProtocal;
    } else {
      // from 以为fingerPrintOfProtocal为基点拉去新消息
      params.from = chat.fingerPrintOfProtocal;
    }
    return this.http.get(GetGroupHistory, params);
  }

}
