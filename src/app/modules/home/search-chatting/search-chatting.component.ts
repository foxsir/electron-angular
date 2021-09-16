import {Component, Input, OnInit} from '@angular/core';
import ChattingModel from "@app/models/chatting.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {CacheService} from "@services/cache/cache.service";
import {formatDate} from "@app/libs/mobileimsdk-client-common";
import CommonTools from "@app/common/common.tools";
import {MsgType} from "@app/config/rbchat-config";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";

@Component({
  selector: 'app-search-chatting',
  templateUrl: './search-chatting.component.html',
  styleUrls: ['./search-chatting.component.scss']
})
export class SearchChattingComponent implements OnInit {
  @Input() chatting: AlarmItemInterface;

  public formatDate = formatDate;
  public commonTools = CommonTools;
  public currentTab: "chat" | "media" | "file" = "chat";
  public keywords = "";

  public avatarMap: Map<string, string> = new Map();

  public chatMap: Map<string, ChatmsgEntityModel> = new Map();
  public imageMap: Map<string, ChatmsgEntityModel> = new Map();
  public fileMap: Map<string, ChatmsgEntityModel> = new Map();

  constructor(
    private cacheService: CacheService,
    private currentChattingChangeService: CurrentChattingChangeService,
  ) {
  }

  ngOnInit(): void {
    this.loadImageAndFile();

    this.currentChattingChangeService.currentChatting$.subscribe(chatting => {
      this.chatting = chatting;
      this.loadImageAndFile();
    });

    this.loadAvatar();
  }

  loadAvatar() {
    if(this.chatting.metadata.chatType === 'friend') {
      this.cacheService.getMyInfo().then(my => {
        this.avatarMap.set(my.userUid.toString(), my.userAvatarFileName);
      });
      this.cacheService.getCacheFriends().then((friendMap) => {
        friendMap.forEach(f => {
          this.avatarMap.set(f.friendUserUid.toString(), f.userAvatarFileName);
        })
      });
    } else {
      this.cacheService.getGroupMembers(this.chatting.alarmItem.dataId).then((memberMap) => {
        memberMap.forEach(f => {
          this.avatarMap.set(f.groupUserId.toString(), f.userAvatarFileName);
        })
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

  txtSearchChange(event: KeyboardEvent) {
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
}
