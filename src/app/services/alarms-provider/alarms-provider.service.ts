import {Injectable} from '@angular/core';
import {AlarmMessageType, MsgType, RBChatConfig} from "@app/config/rbchat-config";
import {LocalUserService} from "@services/local-user/local-user.service";
import RBChatUtils from "@app/libs/rbchat-utils";
import {RestService} from "@services/rest/rest.service";
import {formatDate} from "@app/libs/mobileimsdk-client-common";
import {MessageService} from "@services/message/message.service";
import ChattingModel from "@app/models/chatting.model";


/**
 * 首页“消息”（为防止混淆，本类中称之为“通知”）的数据模型提供者实现类.
 * <p>
 * 提供各种首页“消息”（为防止混淆，本类中称之为“通知”）类型的数据组织和管理功能.
 */
@Injectable({
  providedIn: 'root'
})
export class AlarmsProviderService {
  constructor(
    private localUserService: LocalUserService,
    private restService: RestService,
    private messageService: MessageService
  ) { }

  /**
   * 刷新首页历史"消息"列表中的聊天消息历史item数据(异步方式从服务端加载历史数据).
   * @deprecated
   * @param fn_callback_for_success(alarmsHistoryList) 回调函数，当本参数不为空时，数据加载成后后会通知此回函数，此回调函数里可以实现UI的刷新逻辑等
   */
  refreshHistoryChattingAlarmsAsync() {
    const localUserUid = this.localUserService.getUid();//this.localUserService.getObj().userId;

    // 要加载的聊天记录的开始时间
    let startTime = null;
    const QUERY_DATE_PATTERN = 'yyyy-MM-dd hh:mm:ss';

    // 【计算聊天记录的开始时间查询条件】：当前默认定义为加载15天内的聊天
    // 记录（见RBChatConfig.CHATTING_HISTORY_LOAD_TIME_INTERVAL常量定义）
    const dtForStart = new Date();
    dtForStart.setDate(dtForStart.getDate() - RBChatConfig.CHATTING_HISTORY_LOAD_TIME_INTERVAL);
    startTime = formatDate(dtForStart, QUERY_DATE_PATTERN);

    // 通过rest接口获取首页历史"消息"列表数据
    return this.restService.queryAlarmsHistoryFromServer(localUserUid, startTime);
  }

  /**
   * 刷新首页“消息”列表里的“未处理离线加好友请求”的item数据(异步方式从服务端加载).
   * 注意：此item因跟 refreshAlarmsHistoryAsync()方法处理的普通聊天消息业务类型不同，是单独加载的。
   */
  refreshOfflineAddFriendReqAlarmAsync() {
    const localUserUid = this.localUserService.getUid();
    return this.restService.submitGetOfflineAddFriendsReqCountToServer(localUserUid);
  }

  /**
   * 新建一个临时/陌生人聊天的首页“消息”对象（本地用户发出的消息）。
   * 用于将本地用户主动发出的临时聊天消息也入到首页"消息"栏里.
   *
   * @param messageContentType 见rbchat_config.js中的MsgType类中常量定义
   * @param messageContent 聊天消息内容
   * @param beyondNickName 对方的昵称
   * @param beyondUid
   * @returns
   */
  createATempChatMsgAlarmForLocal(messageContentType, messageContent, beyondNickName, beyondUid) {
    return this.createATempChatMsgAlarm(messageContentType, messageContent, beyondNickName, beyondUid, 0);
  }

  /**
   * 新建一个临时/陌生人聊天的首页“消息”对象。
   *
   * @param messageContentType 见rbchat_config.js中的MsgType类中常量定义
   * @param messageContent 聊天消息内容
   * @param beyondNickName 对方的昵称
   * @param beyondUid 对象的uid
   * @param time java时间戳长整数（形如：1280977330748），本参数小于或等于0于，将自动取当前系统时间戳
   * @returns
   */
  createATempChatMsgAlarm(messageContentType, messageContent, beyondNickName, beyondUid, time): ChattingModel {

    // 新的AlarmMessageDto对象
    // amd.alarmMessageType = AlarmMessageType.tempChatMessage;
    // //amd.title = '陌生人'+(RBChatUtils.isStringEmpty(beyondNickName)?'':' - '+beyondNickName);
    // amd.title = beyondNickName;
    // amd.msgContent = this.messageService.parseMessageForShow(messageContent, messageContentType);
    // amd.date = (time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time);
    //
    // amd.dataId = beyondUid;

    //    application.getString(R.string.sns_friend_strange_message_form_title)
    //    + (CommonUtils.isStringEmpty(tcmd.getNickName(), true)?"":" - "+tcmd.getNickName()));
    //amd.setMsgContent(ChatDataHelper.parseMessageForShow(application, tcmd.getM(), tcmd.getTy()));
    //amd.setDate(time <= 0? ToolKits.getTimeStamp(): time);//tcmd.getMsgTimeForDefaultTimeZone());
    //amd.setFlagNum(""+flagNumToAdd);
    //amd.setExtraObj(tcmd);

    return {
      alarmMessageType: AlarmMessageType.tempChatMessage,
      title: beyondNickName,
      msgContent: this.messageService.parseMessageForShow(messageContent, messageContentType),
      date: (time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time),
      dataId: beyondUid,
      istop: false
    };
  }

  /**
   * 新建一个一对一好友聊天的首页“消息”对象（用于加好友成功后）。
   * 被好加友同意加好友请求后，将入一条空消息到首页消息栏里.
   * <p>
   * 目的是像微信等IM一样，加好友成功后，可以方便的点击此消息进入聊天界面。
   *
   * @param friendNickName 对方的昵称
   */
  createChatMsgAlarmForAddSuccess(friendNickName, friendUid) {
    return this.createChatMessageAlarm(MsgType.TYPE_TEXT, friendNickName + '已是您的好友了，点击开始聊天吧...'
      , friendNickName, friendUid, 0);
  }

  /**
   * 新建一个一对一好友聊天的首页“消息”对象（本地用户发出的消息）。
   * 用于将本地用户主动发出的聊天消息也入到首页"消息"栏里.
   *
   * @param messageContentType 见rbchat_config.js中的MsgType类中常量定义
   * @param messageContent 聊天消息内容
   * @param friendNickName 对方的昵称
   * @param friendUid
   * @returns
   */
  createChatMsgAlarmForLocal(messageContentType, messageContent, friendNickName, friendUid) {
    return this.createChatMessageAlarm(messageContentType, messageContent, friendNickName, friendUid, 0);
  }

  /**
   * 新建一个一对一好友聊天的首页“消息”对象（收到的消息）。
   *
   * @param messageContentType 见rbchat_config.js中的MsgType类中常量定义
   * @param messageContent 聊天消息内容
   * @param friendNickName 对方的昵称
   * @param time java时间戳长整数（形如：1280977330748），本参数小于或等于0于，将自动取当前系统时间戳
   * @returns
   */
  createChatMessageAlarm(messageContentType, messageContent, friendNickName, friendUid, time): ChattingModel {

    //111 处理合并转发的bug
    // let msg = messageContent;
    // messageContent = msg;

    // 新的AlarmMessageDto对象
    return {
      alarmMessageType: AlarmMessageType.reviceMessage,
      title: friendNickName,
      msgContent: this.messageService.parseMessageForShow(messageContent, messageContentType),
      //--
      // msgContent: this.messageService.parseMessageForShow(messageContent, messageContentType),
      date: (time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time),

      dataId: friendUid,
      istop: false
    };
  }

  /**
   * 新建一个添好"加好友被拒绝"的alarm对象.
   *
   * @param beyondNickName
   * @returns
   */
  createAddFriendBeRejectAlarm(beyondNickName, beyondUid) {

    // 新的AlarmMessageDto对象
    return {
      alarmMessageType: AlarmMessageType.addFriendBeReject,
      title: '加好友请求被拒',
      msgContent: '对不起， ' + beyondNickName + ' 拒绝了您的添加好友请求.',
      date: RBChatUtils.getCurrentUTCTimestamp(),
      dataId: beyondUid,
    };
  }

  /**
   * 新建一个“未处理的加好友确认提醒”的alarm对象.
   *
   * @param beyondNickName 最近一次请求者的昵称（仅用于UI显示时）
   * @param reqTimestamp 好友请求时间戳，本参数为空将使用当前默认时间
   * @returns
   */
  createAddFriendReqMergeAlarm(beyondNickName, reqTimestamp) {//, beyondUid){
    // 新的AlarmMessageDto对象
    return {
      alarmMessageType: AlarmMessageType.addFriendRequest,
      title: '确认提醒',
      msgContent: beyondNickName + ' 邀请您成为好友.',
      date: reqTimestamp ? reqTimestamp : RBChatUtils.getCurrentUTCTimestamp(),
      // 数据id就用本地用户的Uid吧（因为首页“消息”里显示的未处理好友
      // 请求Item只会有一条，用请求者的uid作为这里的数据id就不合适了）
      dataId: this.localUserService.getUid() //beyondUid
    };
  }

  /**
   * 新建一个"群组聊天消息"的首页“消息”对象（本地用户发出的消息）。
   * 用于将本地用户主动发出的消息也入到首页"消息"栏里.
   *
   * @param messageContentType
   * @param messageContent
   * @param toGname
   * @returns
   */
  createAGroupChatMsgAlarmForLocal(messageContentType, messageContent, toGname, toGid) {

    return this.createAGroupChatMsgAlarm(messageContentType, messageContent, toGname, toGid, null, 0);
  }

  /**
   * 新建一个“群组聊天消息”的alarm对象.
   *
   * @param messageContentType
   * @param messageContent
   * @param toGname
   * @param fromUserNickName
   * @param time
   * @returns
   */
  createAGroupChatMsgAlarm(messageContentType, messageContent, toGname, toGid, fromUserNickName, time): ChattingModel {
    //111 为了显示撤回。转发等带有json的样式而处理
    // let msg = messageContent,
    // messageContent = msg;
    //-----
    // 新的AlarmMessageDto对象
    const amd: ChattingModel = {
      alarmMessageType: AlarmMessageType.groupChatMessage,
      title: toGname,
      //原版
      // msgContent: (RBChatUtils.isStringEmpty(fromUserNickName)?'': fromUserNickName+': ')
      //     + this.messageService.parseMessageForShow(messageContent, messageContentType);
      msgContent: (RBChatUtils.isStringEmpty(fromUserNickName) ? '' : fromUserNickName + ': ')
        + this.messageService.parseMessageForShow(messageContent, messageContentType),
      date: (time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time),
      dataId: toGid,
      istop: false,
    };

    return amd;
  }

}
