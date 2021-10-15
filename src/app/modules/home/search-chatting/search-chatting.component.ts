import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import ChattingModel from "@app/models/chatting.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CacheService} from "@services/cache/cache.service";
import {formatDate} from "@app/libs/mobileimsdk-client-common";
import CommonTools from "@app/common/common.tools";
import {MsgType} from "@app/config/rbchat-config";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {Subscription} from "rxjs";
import {DomSanitizer} from "@angular/platform-browser";
import closeIcon from "@app/assets/icons/close.svg";
import closeActiveIcon from "@app/assets/icons/close-active.svg";

@Component({
  selector: 'app-search-chatting',
  templateUrl: './search-chatting.component.html',
  styleUrls: ['./search-chatting.component.scss']
})
export class SearchChattingComponent implements OnInit ,OnDestroy{
  @Input() chatting: AlarmItemInterface;

  public closeIcon = this.dom.bypassSecurityTrustResourceUrl(closeIcon);
  public closeActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeActiveIcon);
  public formatDate = formatDate;
  public commonTools = CommonTools;
  public currentTab: "chat" | "media" | "file" = "chat";
  public keywords = "";

  public avatarMap: Map<string, string> = new Map();

  public chatMap: Map<string, ChatmsgEntityModel> = new Map();
  public imageMap: Map<string, ChatmsgEntityModel> = new Map();
  public fileMap: Map<string, ChatmsgEntityModel> = new Map();

  public currentSubscription: Subscription;

  constructor(
    private dom: DomSanitizer,
    private cacheService: CacheService,
    private currentChattingChangeService: CurrentChattingChangeService,
  ) {
  }

  ngOnInit(): void {
    this.loadImageAndFile();

    this.currentSubscription = this.currentChattingChangeService.currentChatting$.subscribe(chatting => {
      if(chatting) {
        this.chatting = chatting;
        this.loadImageAndFile();
      }
    });

    this.loadAvatar();
  }

  loadAvatar() {
    if(this.chatting.metadata.chatType === 'friend') {
      this.cacheService.getMyInfo().then(my => {
        this.avatarMap.set(my.userUid.toString(), my.userAvatarFileName);
      });
      this.cacheService.getCacheFriends().then((friendMap) => {
        friendMap.forEach(friend => {
          this.avatarMap.set(friend.friendUserUid.toString(), friend.userAvatarFileName);
        });
      });
    } else {
      this.cacheService.getGroupMembers(this.chatting.alarmItem.dataId).then((memberMap) => {
        memberMap.forEach(member => {
          this.avatarMap.set(member.userUid.toString(), member.userAvatarFileName);
        });
      });
    }
  }

  loadImageAndFile() {
    this.chatMap.clear();
    this.imageMap.clear();
    this.fileMap.clear();
    this.cacheService.getChattingCache(this.chatting).then(data => {
      data.forEach((msg) => {
        if(msg.msgType === MsgType.TYPE_IMAGE) {
          this.imageMap.set(msg.fingerPrintOfProtocal, msg);
        } else if(msg.msgType === MsgType.TYPE_FILE) {
          this.fileMap.set(msg.fingerPrintOfProtocal, msg);
        }
      });
    });
  }

  txtSearchChange() {
    this.currentTab = 'chat';
    this.cacheService.getChattingCache(this.chatting).then(data => {
      this.chatMap.clear();
      data.forEach((msg) => {
        if(msg.msgType === MsgType.TYPE_TEXT) {
          if(msg.text.includes(this.keywords)) {
            this.chatMap.set(msg.fingerPrintOfProtocal, msg);
          }
        }
      });
    });
  }

  ngOnDestroy() {
    this.currentSubscription.unsubscribe();
  }
}
