import { Injectable } from '@angular/core';
import {ChatModeType, MsgType} from "@app/config/rbchat-config";
import {ProtocalModel, ProtocalModelDataContent} from "@app/models/protocal.model";
import {CacheService} from "@services/cache/cache.service";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {MessageEntityService} from "@services/message-entity/message-entity.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";

@Injectable({
  providedIn: 'root'
})
export class ServerForwardService {

  public functions = {
    [MsgType.TYPE_BACK]: this.backMessage.bind(this),
    [MsgType.TYPE_TIREN]: this.tiRenMessage.bind(this),
    [MsgType.TYPE_SYSTEAM$INFO]: this.systemMessage.bind(this),
    [MsgType.TYPE_READED]: this.readStatus.bind(this),
    [MsgType.TYPE_GETREDBAG]: this.getRedbag.bind(this),
    [MsgType.TYPE_TRANSFER_MONEY]: this.transferMoney.bind(this),
    [MsgType.TYPE_GROUP_ADMIN]: this.groupAdminUpdate.bind(this),
    [MsgType.TYPE_VOICE_CALL]: this.voiceCall.bind(this),
    [MsgType.TYPE_NOTALK]:this.groupNoTalk.bind(this),
  };

  constructor(
    private cacheService: CacheService,
    private currentChattingChangeService: CurrentChattingChangeService,
    private messageEntityService: MessageEntityService,
    private localUserService: LocalUserService,
    private snackBarService: SnackBarService,
  ) { }

  private backMessage(res: ProtocalModel) {
    const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
    const msg = JSON.parse(dataContent.m);
    const chatType = dataContent.cy === 0 ? 'friend' : 'group';

    let sendId: string;
    if(chatType === 'group') {
      sendId = dataContent.t;
    } else {
      sendId = msg.sendId;
    }

    this.cacheService.generateAlarmItem(sendId, chatType, msg.msg, dataContent.ty).then(alarm => {
      this.cacheService.getChattingCache(alarm).then(caches => {
        const chat = caches.get(msg.uuid); console.dir(chat);
        if(chat) {
          chat.text = msg.msg;
          chat.msgType = MsgType.TYPE_BACK;
          this.cacheService.putChattingCache(alarm, chat).then(() => {
            if(this.cacheService.chatMsgEntityMap.get(chat.fingerPrintOfProtocal)) {

              if(msg.showMsg===false){
                this.cacheService.chatMsgEntityMap.delete(chat.fingerPrintOfProtocal);
                this.cacheService.putMsgEntityMap();
              }
              else {
                this.cacheService.putMsgEntityMap(chat);
                // this.cacheService.chatMsgEntityMap.set(chat.fingerPrintOfProtocal, chat);
              }
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

  /** 系统消息 */
  private systemMessage(res: ProtocalModel) {
    const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
    const txtMsg=dataContent.m;
    this.cacheService.saveSystemMessage(dataContent.t, txtMsg, res.sm, res.fp);
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
                  // this.cacheService.chatMsgEntityMap.set(chat.fingerPrintOfProtocal, chat);
                  this.cacheService.putMsgEntityMap(chat);
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

  private getRedbag(res: ProtocalModel) {
    const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
    const chatMsgEntity = this.messageEntityService.prepareRecievedMessage(
      res.from, dataContent.nickName, dataContent.m, (new Date()).getTime(), dataContent.ty, res.fp
    );

    const text = JSON.parse(dataContent.m);
    chatMsgEntity.uh = dataContent.uh;
    chatMsgEntity.redId = text.redId;
    // fromUid, nickName, msg, time, msgType, fp = null
    const chatType = Number(dataContent.cy) === ChatModeType.CHAT_TYPE_FRIEND$CHAT ? 'friend' : 'group';
    let dataId = chatType === 'friend' ? res.from : dataContent.f;

    // 如果消息来自自己，则为不同终端同步消息
    if(dataId.toString() === this.localUserService.localUserInfo.userId.toString()) {
      dataId = res.to;
    }

    this.cacheService.generateAlarmItem(dataId.toString(), chatType, dataContent.m, dataContent.ty).then(alarm => {
      chatMsgEntity.xu_isRead_type = true;
      chatMsgEntity.isOutgoing = true;
      const currentChat = this.currentChattingChangeService.currentChatting;
      this.cacheService.queryData<ChatmsgEntityModel>({model: 'chatmsgEntity', query: {redId: chatMsgEntity.redId}}).then((res) => {
        res.data.forEach(msg => {
          const t = JSON.parse(msg.text);
          t.status = '2'; // 修改为已经领取
          msg.text = JSON.stringify(t);
          if(this.localUserService.localUserInfo.userId !== dataContent.f && chatType === 'friend') {
            this.cacheService.putChattingCache(alarm, msg, false).then(() => {
              // this.cacheService.chatMsgEntityMap.set(msg.fingerPrintOfProtocal, msg);
              this.cacheService.putMsgEntityMap(msg);
            });
          }
          this.cacheService.putChattingCache(alarm, chatMsgEntity, true).then(() => {
            if(currentChat && currentChat.alarmItem.dataId === alarm.alarmItem.dataId) {
              // this.cacheService.chatMsgEntityMap.set(chatMsgEntity.fingerPrintOfProtocal, chatMsgEntity);
              this.cacheService.putMsgEntityMap(chatMsgEntity);
            }
          });
        });
      });
    });
  }

  /**
   * 处理转账消息
   * @param res
   * @private
   */
  private transferMoney(res: ProtocalModel) {
    const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
    this.cacheService.saveSystemMessage(dataContent.f.toString(), "转账消息请在手机上查看", res.sm, res.fp);
  }

  /** 群管理员变更 */
  private  groupAdminUpdate(res: ProtocalModel){
    const dataContent: ProtocalModelDataContent[] = JSON.parse(res.dataContent);
    const msg=JSON.parse(dataContent[0].m);
    const txtMsg="\""+msg.nicNames[0]+"\""+(msg.nicNames.length>1?"等"+msg.nicNames.length.toString()+"人":"")+
                  (msg.type === 1?"成为":"被取消")+"管理员";
    this.cacheService.saveSystemMessage(dataContent[0].t, txtMsg, res.sm, res.fp);
  }

  // 语音通话消息
  private voiceCall(res: ProtocalModel) {
    const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
    const txtMsg = "语音通话请在手机上查看";
    this.cacheService.saveSystemMessage(res.from.toString(), txtMsg, res.sm, res.fp);
  }

  /** 群禁言解禁 **/
  private groupNoTalk(res: ProtocalModel) {
    console.dir(11111111111111)
    const dataContent: ProtocalModelDataContent[] = JSON.parse(res.dataContent);
    const msg=JSON.parse(dataContent[0].m);
    this.cacheService.saveSystemMessage(dataContent[0].t.toString(), msg.msg, res.sm, res.fp);
  }

}
