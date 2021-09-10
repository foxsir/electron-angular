import { Injectable } from '@angular/core';
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {ImService} from "@services/im/im.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {createCommonData2} from "@app/libs/mobileimsdk-client-common";
import {ChatModeType, UserProtocalsType} from "@app/config/rbchat-config";

@Injectable({
  providedIn: 'root'
})
export class TempMessageService {

  constructor(
    private snackBarService: SnackBarService,
    private imService: ImService,
    private localUserService: LocalUserService,
  ) { }

  //*********************************************************************** （1）解析接收的消息或指令 START
  /**
   * 解析临时聊天消息：由服务端转发给接收人B的【步骤2/2】.
   *
   * <p>
   * 当然，此消息被接收到的前提条件是B用户此时是在线的（否则临时聊天消息将服务端被存储到DB中（直到本地用户下次上线））。
   *
   * @param originalMsg 服务端返回对象的JSON文本形式
   * @return 返回值为MsgBody4Guest对象，详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/MsgBody4Guest.html
   */
  parseTempChatMsg_SERVER$TO$B_Message(originalMsg) {
    console.info("!!!!!!收到服务端发过来的临时聊天信息：" + originalMsg);
    return JSON.parse(originalMsg);
  }

  //*********************************************************************** （1）解析接收的消息或指令 END


  //*********************************************************************** （2）发出的消息或指令 START

  ///**
  // * 将指定的图片消息发送给聊天中的好友.
  // */
  //_sendGuestPlainTextMessage(guestUID, message, fn_callback) {
  //    _sendGuestMessage(MsgType.TYPE_TEXT, guestUID, message, fn_callback);
  //}
  //
  ///**
  // * 将指定的图片消息发送给聊天中的好友.
  // */
  //_sendGuestImageMessage(guestUID, imageFileName, fn_callback) {
  //    _sendGuestMessage(MsgType.TYPE_IMAGE, guestUID, imageFileName, fn_callback);
  //}

  sendGuestMessage(msgType, guestUID, msgContent, fn_callback) {

    var sucess = false;
    var msgBody = null;

    // if (!RBChatChattingContentPaneUI.send4IMCheck()) {
    //   //
    // } else
    if (!guestUID) {
      //alert('消息接收者不能为空！');
      this.snackBarService.openMessage('消息接收者不能为空！');
    } else if (!msgContent) {
      //alert('消息内容不能为空！');
      this.snackBarService.openMessage('消息内容不能为空！');
    } else {
      // 消息发送者uid（就是本地用户的uid了）
      var fromUid = this.imService.getLoginInfo().loginUserId;
      var localAuthedUserInfo = this.localUserService.getObj();

      var fromNickname = localAuthedUserInfo.nickname;
      fromNickname = (fromNickname ? fromNickname : fromUid);
      // 要发送的昨时聊天消息内容，实际上是一个MsgBody4Guest对象
      // （详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/MsgBody4Guest.html）
      msgBody = this._constructGuestChatMsgBody(msgType, fromUid, fromNickname, guestUID, msgContent);
      // 构建建IM协议报文包（即Protocal对象，
      // 详见：http://docs.52im.net/extend/docs/api/mobileimsdk/server/net/openmob/mobileimsdk/server/protocal/Protocal.html）
      var p = createCommonData2(
        JSON.stringify(msgBody)  // 协议体内容
        , fromUid                // 消息发起者
        , '0'                    // 消息中转接收者（因为陌生人消息不允许直发给对方（因为不是好友关系嘛），所以必须由服务端代为转发）
        , UserProtocalsType.MT42_OF_TEMP$CHAT$MSG_A$TO$SERVER);

      // 将消息通过websocket发送出去
      this.imService.sendData(p);

      sucess = true;
    }

    if (fn_callback) {
      fn_callback(sucess, msgBody);
    }
  }

  /**
   * 构造陌生人聊天（临时聊天）消息协议体的 MsgBody4Guest DTO对象.
   * （MsgBody4Guest对象详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/MsgBody4Guest.html）
   *
   * @param msgType 聊天消息类型
   * @param srcUserUid 发送方的uid
   * @param srcNickName 发送方的昵称
   * @param friendUid 要发送到的用户id
   * @param msg 消息内容，纯文本字串，可能是聊天文字、图片文件名或语音文件名等，但一定不是JSON字串
   * @return
   */
  _constructGuestChatMsgBody(msgType, srcUserUid, srcNickName, friendUid, msg) {
    // 新的MsgBody4Guest对象
    var tcmd: any = {};
    tcmd.cy = ChatModeType.CHAT_TYPE_GUEST$CHAT; // 聊天模式类型：一对一临时聊天(陌生人聊天)
    tcmd.f = srcUserUid;
    tcmd.nickName = srcNickName;
    tcmd.t = friendUid;
    tcmd.m = msg;
    tcmd.ty = msgType;

    return tcmd;
  }

  //*********************************************************************** （2）发出的消息或指令 END

}
