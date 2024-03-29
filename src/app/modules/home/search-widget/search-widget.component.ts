import {Component, OnInit} from '@angular/core';

import editIcon from "@app/assets/icons/edit.svg";
import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";
import {DomSanitizer} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {CacheService} from "@services/cache/cache.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {IndexComponent} from "@modules/session/index/index.component";
import {GlobalCache} from "@app/config/global-cache";

@Component({
  selector: 'app-search-widget',
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.scss']
})
export class SearchWidgetComponent implements OnInit {
  public editIcon = this.dom.bypassSecurityTrustResourceUrl(editIcon);
  public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
  public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
  public showResource: boolean = false;
  public search: string;

  public alarmItemList: Map<string, any> = new Map();

  public find_friends: any[] = [];
  public find_messages: any[] = [];
  public globalCache = GlobalCache.getAll();

  constructor(
    private dom: DomSanitizer,
    private router: Router,
    private cacheService: CacheService,
    private currentChattingChangeService: CurrentChattingChangeService,
  ) {
  }

  ngOnInit(): void {
    this.cacheService.getChattingList().then(res => {
      if (res) {
        this.alarmItemList = new Map();
        res.forEach(item => this.alarmItemList.set(item.alarmData.alarmItem.dataId, item.alarmData));

        console.log('聊天列表 01：', this.alarmItemList);
      }
    });
  }

  /**
   * 创建群
   */
  createGroup() {
    return this.router.navigate(['/home/message/create-group']);
  }

  /**
   * 搜索好友
   */
  searchFriend() {
    return this.router.navigate(['/home/message/search-friend']);
  }

  searchContent() {
    if (!this.showResource) {
      this.showResource = !this.showResource;
    }
  }

  /**
   * 取消搜索
   */
  cancelSearch() {
    this.search = null;
    this.showResource = false;
  }

  /**
   * 文本框搜索
   * @param event
   */
  txtSearchChange() {
    this.find_friends = [];
    this.find_messages = [];
    console.log('回车确认：', this.search, this.alarmItemList);
    const search_low = this.search.toLowerCase();

    this.alarmItemList.forEach((item: AlarmItemInterface) => {
      console.dir(item);
      console.log('消息Model：', item);
      if (item.alarmItem.title.indexOf(search_low) !== -1) {
        this.find_friends.push({
          avatar: item.alarmItem.avatar,
          title: item.alarmItem.title,
          msgContent: item.alarmItem.msgContent,
          dataId: item.alarmItem.dataId,
          chatType: item.metadata.chatType,
        });
      }

      this.cacheService.getChattingCache(item).then((message) => {
        message.forEach(msg => {
          console.log('消息：', msg.text);
          if (msg.text.indexOf(search_low) !== -1) {
            console.log('find msg: ', msg);
            this.find_messages.push({
              avatar: item.alarmItem.avatar,
              title: item.alarmItem.title,
              msgContent: msg.text,
              dataId: item.alarmItem.dataId,
              chatType: item.metadata.chatType,
            });
          }
        });
      });
    });

    console.log('find_friends: ', this.find_friends);
    console.log('find_messages: ', this.find_messages);
  }

  /**
   * 切换好友
   * @param item
   */
  switchChatting(item: { dataId: string }) {
    if (this.alarmItemList.get(item.dataId)) {
      this.currentChattingChangeService.switchCurrentChatting(this.alarmItemList.get(item.dataId)).then(() => {
        this.cancelSearch();
      });
    }
  }

}
