import { Injectable } from '@angular/core';
import {MsgType} from "@app/config/rbchat-config";
import {ProtocalModel, ProtocalModelDataContent} from "@app/models/protocal.model";
import {CacheService} from "@services/cache/cache.service";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

@Injectable({
  providedIn: 'root'
})
export class ServerForwardService {

  public functions = {
    [MsgType.TYPE_BACK]: this.backMessage.bind(this),
    [MsgType.TYPE_TIREN]: this.tiRenMessage.bind(this),
    [MsgType.TYPE_SYSTEAM$INFO]: this.systemMessage.bind(this),
    [MsgType.TYPE_READED]: this.readStatus.bind(this),
  };

  constructor(
    private cacheService: CacheService,
    private currentChattingChangeService: CurrentChattingChangeService,
  ) { }

  private backMessage(res: ProtocalModel) {
    console.dir("撤回消息");
    const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
    const msg = JSON.parse(dataContent.m);
    console.log(res);
    const chatType = dataContent.cy === 0 ? 'friend' : 'group';
    this.cacheService.generateAlarmItem(msg.senderId, chatType, msg.msg, dataContent.ty).then(alarm => {
      this.cacheService.getChattingCache(alarm).then(caches => {
        const chat = caches.get(msg.uuid);
        chat.text = msg.msg;
        if(chat) {
          chat.msgType = MsgType.TYPE_BACK;
          this.cacheService.putChattingCache(alarm, chat).then(() => {
            if(this.cacheService.chatMsgEntityMap.get(chat.fingerPrintOfProtocal)) {
              this.cacheService.chatMsgEntityMap.set(chat.fingerPrintOfProtocal, chat);
            }
          });
        }
      });
    });
  }

  private tiRenMessage(res: ProtocalModel) {
    console.dir("踢人");
    console.dir(res);
  }

  private systemMessage(res: ProtocalModel) {
    console.dir("系统");
    console.dir(res);
  }

  private readStatus(res: ProtocalModel) {
    // console.dir("已读");
    if(this.currentChattingChangeService.currentChatting) {
      const chatting = this.currentChattingChangeService.currentChatting;
      this.cacheService.getChattingCache(chatting).then((cache) => {
        if(cache) {
          const entries = new Array(...cache.values()).reverse().entries();
          const loop = (chat: ChatmsgEntityModel) => {
            if(chat && chat.xu_isRead_type !== true) {
              chat.xu_isRead_type = true;
              chat.isOutgoing = true;
              this.cacheService.putChattingCache(chatting, chat).then(() => {
                if(this.cacheService.chatMsgEntityMap.get(chat.fingerPrintOfProtocal)) {
                  this.cacheService.chatMsgEntityMap.set(chat.fingerPrintOfProtocal, chat);
                }
                const value = entries.next().value;
                if(value) {
                  loop(value[1]);
                }
              });
            }
          };
          loop(entries.next().value[1]);
        }
      });
    }
  }

}
