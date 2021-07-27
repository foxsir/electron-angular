import { Component, OnInit } from '@angular/core';
import {AlarmsProviderService} from "@services/alarms-provider/alarms-provider.service";
import RBChatUtils from "@app/libs/rbchat-utils";
import {AlarmMessageType, ChatModeType, RBChatConfig, UserProtocalsType} from "@app/config/rbchat-config";
import {LocalUserService} from "@services/local-user/local-user.service";
import {RestService} from "@services/rest/rest.service";
import {createCommonData2, formatDate} from "@app/libs/mobileimsdk-client-common";
import {GroupChattingCacheService} from "@services/group-chatting-cache/group-chatting-cache.service";
import {SingleChattingCacheService} from "@services/single-chatting-cache/single-chatting-cache.service";
import {MessageEntityService} from "@services/message-entity/message-entity.service";

// import image
import edit from "./images/edit.png";
import LocalUserInfo from "@app/models/LocalUserInfo";
import {MatMenuTrigger} from "@angular/material/menu";
import {ImService} from "@services/im/im.service";
import ChatMsgEntity from "@app/models/ChatMsgEntity";
import {MessageService} from "@services/message/message.service";
import {GroupsProviderService} from "@services/groups-provider/groups-provider.service";
import {TempMessageService} from "@services/temp-message/temp-message.service";
import {GroupMessageService} from "@services/group-message/group-message.service";
import {RosterProviderService} from "@services/roster-provider/roster-provider.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import OriginData from "@app/models/OriginData";
import {MessageDistributeService} from "@services/message-distribute/message-distribute.service";
import HttpResponse from "@app/models/HttpResponse";
import AlarmData from "@app/models/AlarmData";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  public alarmItemList: AlarmData[] = [];
  public chatMsgEntityList: ChatMsgEntity[] = [];
  public currentChat: AlarmData;
  public formatDate = formatDate;
  public localUserInfo: LocalUserInfo;

  public massageBadges = {};

  // image
  public edit = edit;

  constructor(
    private alarmsProviderService: AlarmsProviderService,
    private groupsProviderService: GroupsProviderService,
    private localUserService: LocalUserService,
    private restService: RestService,
    private messageEntityService: MessageEntityService,
    private messageService: MessageService,
    private groupMessageService: GroupMessageService,
    private tempMessageService: TempMessageService,
    private rosterProviderService: RosterProviderService,
    private groupChattingCacheService: GroupChattingCacheService,
    private singleChattingCacheService: SingleChattingCacheService,
    private imService: ImService,
    private snackBarService: SnackBarService,
    private messageDistributeService: MessageDistributeService
  ) {
    this.localUserInfo = this.localUserService.localUserInfo;

    this.messageDistributeService.MT03_OF_CHATTING_MESSAGE$.subscribe((data: OriginData) => {
      const dataContent: any = JSON.stringify(data.dataContent);
      // alert("单聊" + data.from);
      this.massageBadges[data.from.trim()] = 4;

      console.dir(this.massageBadges);
    });

    // this.messageDistributeService.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER$.subscribe((data: OriginData) => {
    //   const dataContent: any = JSON.parse(data.dataContent);
    //   alert("群组" + dataContent.f);
    // });

    this.messageDistributeService.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B$.subscribe((data: OriginData) => {
      const dataContent: any = JSON.parse(data.dataContent);
      // alert("群组" + dataContent.t);
      this.massageBadges[dataContent.t.trim()] = 99;
    });
  }

  ngOnInit(): void {
    this.alarmsProviderService.refreshHistoryChattingAlarmsAsync().subscribe((res: HttpResponse) => {
      if (res.success) {
        const list = JSON.parse(res.returnValue);
        this.showChattingList(list);
      } else {
        console.dir(res);
        this.snackBarService.openSnackBar("数据加载失败");
      }
    });
  }

  showChattingList(list: []) {
    list.forEach(row => {
      const chatUserUid = row[0];
      const chatUserNickname = row[1];

      // 聊天消息类型，见MsgBodyRoot类中的定义
      // 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/constant-values.html#com.x52im.rainbowchat.im.dto.MsgBodyRoot.CHAT_TYPE_GROUP$CHAT
      const msgType = row[2];
      const msgContent = row[3];
      const msgTimestamp = row[5]; // 消息时间（java时间戳）

      const isFriend = Number(row[7]); // 此聊天对象是否是“我”的好友，本字段值为：0或1

      const chatType = Number(row[8]); // 2表示群聊，否则是单聊（See ChatModeType）
      const gid = row[9]; // 群id（群聊消息时有意义）
      const gname = row[10]; // 群名称（群聊消息时有意义）

      const istop = row[12];//111 置顶

      // const isonLine = row[12];//111 置顶


      let alarmData = null;

      // 群聊消息
      if (chatType === ChatModeType.CHAT_TYPE_GROUP$CHAT) {

        // 群聊消息的发出者uid
        const srcUid = row[6];
        // true表示是我自已发出的群聊消息
        const isMe = (srcUid === this.localUserService.getUid());

        // 我自已发出的消息，在首页“消息”里显示时，不需要显示昵称了（就像微信一样）;
        //111 新增了 57
        if (msgType != "57") {
          alarmData = this.alarmsProviderService.createAGroupChatMsgAlarm(msgType, msgContent, gname, gid,
            isMe ? null : chatUserNickname, RBChatUtils.isStringEmpty(msgTimestamp) ?
              RBChatUtils.getCurrentUTCTimestamp() : msgTimestamp,);
          //111 插入置顶
          alarmData.istop = istop;
          this.insertItem(alarmData, false);
        }

      } else { // 单聊消息
        // 是“我”的好友
        if (isFriend === 1) {
          alarmData = this.alarmsProviderService.createChatMessageAlarm(
            msgType, msgContent, chatUserNickname, chatUserUid, RBChatUtils
              .isStringEmpty(msgTimestamp) ? RBChatUtils.getCurrentUTCTimestamp() :
              msgTimestamp);
        } else {
          alarmData = this.alarmsProviderService.createATempChatMsgAlarm(
            msgType, msgContent, chatUserNickname, chatUserUid, RBChatUtils
              .isStringEmpty(msgTimestamp) ? RBChatUtils.getCurrentUTCTimestamp() :
              msgTimestamp);
        }
        //111 插入置顶
        alarmData.istop = istop;
        this.insertItem(alarmData, false);
      }
    });
  }

  insertItem(alarmData: AlarmData, atTheTop: boolean) {
    if (this.currentChat === undefined) {
      this.currentChat = alarmData;
    }
    Object.assign(this.massageBadges, {[alarmData.dataId.trim()]: 0});

    if (Object.is(atTheTop, true)) {
      this.alarmItemList = [alarmData, ...this.alarmItemList];
    } else {
      this.alarmItemList = [ ...this.alarmItemList, alarmData];
    }
  }

  /**
   * 切换聊天对象
   *
   * @param alarm
   */
  switchChat(alarm) {
    this.currentChat = alarm;

    this.chatMsgEntityList = [];
    this.loadChattingHistoryFromServer(this.currentChat);
  }

  loadChattingHistoryFromServer(currentChat) {
    const isGroupChatting = currentChat.currentChat === AlarmMessageType.groupChatMessage;
    const beyongDataId = currentChat.dataId;

    // 要加载的聊天记录的开始时间
    let startTime = null;
    // 要加载的聊天记录的结束时间
    let endTime = null;
    const QUERY_DATE_PATTERN = 'yyyy-MM-dd hh:mm:ss';

    // 【计算聊天记录的开始时间查询条件】：当前默认定义为加载15天内的聊天
    // 记录（见RBChatConfig.CHATTING_HISTORY_LOAD_TIME_INTERVAL常量定义）
    const dtForStart = new Date();
    dtForStart.setDate(dtForStart.getDate() - RBChatConfig.CHATTING_HISTORY_LOAD_TIME_INTERVAL);
    startTime = formatDate(dtForStart, QUERY_DATE_PATTERN);

    // 【计算聊天记录的结束时间查询条件】：如果当前缓存中已存在聊天消息数据，则取此时间作为加载的结束时间，
    // 这么做的原因，是防止当本地用户登陆后，已载离线聊天数据之后，首次点进聊天界面时，会重复加载历史，
    // 聊天记录的问题（因为之前加载的离线消息，早已进入了服务端的聊天记录中，本次如果不加这个查询截止
    // 时间，则数据当然就会被重复加载罗！）
    const firstChatMsgEntity = (isGroupChatting ? this.groupChattingCacheService.getChatCacheFirst(beyongDataId) :
      this.singleChattingCacheService.getChatCacheFirst(beyongDataId)); // 取出当天聊天缓存数据中的第一条消息对象
    if (firstChatMsgEntity) {
      const firstMsgTimestamp = firstChatMsgEntity.date; // 取出该条缓存消息的时间戳
      if (firstMsgTimestamp) {
        const dtForEnd = new Date();
        // 之所以将此时间主动减去1000毫秒，是因为服务端的SQL查询"BETWEEN AND"的右边界问题会导
        // 致该第一条消息还是会重，主动减1秒则下方formatDate(..)转时分秒格式后，就能保证不存在
        // 边界导致的查询重复（因为直接少了1秒啊）
        dtForEnd.setTime(firstMsgTimestamp - 1000);
        endTime = formatDate(dtForEnd, QUERY_DATE_PATTERN); // 将时间戳转了字符串日期格式（便于提前服务端接口使用）
      }
    }

    this.restService.queryChattingHistoryFromServer(
      //111 新增
      isGroupChatting, beyongDataId, this.localUserService.getObj().user_uid, beyongDataId, "1",
      startTime, endTime
    ).subscribe(res => {

      const dataList: [] = JSON.parse(res.returnValue);

      dataList.forEach(row => {
        const srcUid = row[0];
          const destUid = row[1];
          const chat_type = row[2];
          const msg_type = row[3];
          const msgContent = row[4];
          const msgTime2Timestamp = row[5];
          const fingerPrint = row[6];

        // true表示此行数据是群聊息，否则是单聊的
        const returnIsGroupChatting = (chat_type === ChatModeType.CHAT_TYPE_GROUP$CHAT);
        // true表示是“我”发出的消息，否则是“我”收到的消息（即对方发给“我”的）
        // var isOutgoing = (srcUid == IMSDK.getLoginInfo().loginUserId);
        //111 这是在加上登录web 标识后取值错误，换内存取
        const isOutgoing = (srcUid == this.localUserService.getObj().user_uid);

        // 消息发送者的uid
        const beyongUid = returnIsGroupChatting ? srcUid : (isOutgoing ? destUid :
          srcUid);
        // 群组id（只在群聊消息时才有意义）
        const gid = returnIsGroupChatting ? destUid : null;

        //console.error('>>>>>> srcUid='+srcUid+', IMSDK.getLoginInfo().loginUserId='+IMSDK.getLoginInfo().loginUserId
        //    +", isOutgoing?"+isOutgoing+", beyongUid="+beyongUid);

        //## Bug FIX: 检查该fingerPrint的消息是否已存在于缓存中，如存在则不需要添加，否则就重
        //##            复了，此为解决209170914日开会指出的存在聊天消息首次从历史加载时会重复的问题
        if (fingerPrint) {
          if (returnIsGroupChatting) {
            if (this.groupChattingCacheService.containsFingerPrintInChatCache(gid,
              fingerPrint)) {
              // RBChatUtils.logToConsole('[前端-GET-【接口1008-26-8】' + TAG +
              //   '群聊天记录获取接口返回值解析后] - 来自dataId=' + beyongDataId + '的fp=' +
              //   fingerPrint +
              //   '的消息已存在于缓存中，不需要重复添加，继续循环的下一轮【!!】！');
            }
          } else {
            if (this.singleChattingCacheService.containsFingerPrintInChatCache(beyongUid,
              fingerPrint)) {
              // RBChatUtils.logToConsole('[前端-GET-【接口1008-26-8】' + TAG +
              //   '单聊天记录获取接口返回值解析后] - 来自dataId=' + beyongDataId + '的fp=' +
              //   fingerPrint +
              //   '的消息已存在于缓存中，不需要重复添加，继续循环的下一轮【!!】！');
            }
          }
        }
        //## Bug FIX END

        let chatMsgEntity = null;
        if (isOutgoing) {
          chatMsgEntity = this.messageEntityService.prepareSendedMessage(msgContent,
            msgTime2Timestamp ? msgTime2Timestamp : 0, fingerPrint, msg_type);
        } else {
          chatMsgEntity = this.messageEntityService.prepareRecievedMessage(beyongUid,
            beyongUid // TODO: 显示昵称？（从好友列表？从首页“消息”的item上取？
            , msgContent, msgTime2Timestamp ? msgTime2Timestamp : 0, msg_type);
        }

        //111 这个是新增 为了存对方发消息的消息的指纹 下面是对方的昵称  增加了已读类型
        chatMsgEntity.fingerPrintOfProtocal = fingerPrint;
        chatMsgEntity.name = row[7];
        chatMsgEntity.xu_isRead_type = row[3];  //增加了已读类型
        // 放入数组
        if (chatMsgEntity.xu_isRead_type !== "57") {
          // chatHistoryDatas.push(chatMsgEntity);
          // console.dir(chatMsgEntity.uid);
          this.chatMsgEntityList.unshift(chatMsgEntity);
          // console.dir(chatMsgEntity);
        }
      });
    });
  }

  textMenu(e: MouseEvent, menu: MatMenuTrigger, span: HTMLSpanElement) {
    menu.openMenu();
    span.style.position = "absolute";
    span.style.top = "0px";
    span.style.left = "0px";
    span.style.transform = `translate3d(${e.offsetX}px, ${e.offsetY}px, 0px)`;
    return e.defaultPrevented;
  }

}
