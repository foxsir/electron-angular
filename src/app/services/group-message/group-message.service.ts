import { Injectable } from '@angular/core';
import {GroupsProviderService} from "@services/groups-provider/groups-provider.service";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {createCommonData2} from "@app/libs/mobileimsdk-client-common";
import {ChatModeType, MsgType, UserProtocalsType} from "@app/config/rbchat-config";
import * as uuid from "uuid";
import {LocalUserService} from "@services/local-user/local-user.service";
import {ImService} from "@services/im/im.service";

@Injectable({
  providedIn: 'root'
})
// GMessageHelper 对象
export class GroupMessageService {

  constructor(
    private groupsProviderService: GroupsProviderService,
    private snackBarService: SnackBarService,
    private localUserService: LocalUserService,
    private imService: ImService,
  ) {
  }

  //*********************************************************************** （1）解析接收的消息或指令 START
  /**
   * 解析群聊聊天消息：由服务端转发给接收人B的【步骤2/2】.
   *
   * <p>
   * 当然，此消息被接收到的前提条件是B用户此时是在线的（否则临时聊天消息将服务端被存储到DB中（直到本地用户下次上线））。
   *
   * @param originalMsg
   * @return {*} 返回的是MsgBody4Group对象
   * ，详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/MsgBody4Group.html
   */
  parseGroupChatMsg_SERVER$TO$B_Message(originalMsg) {
    console.info("!!!!!!收到服务端发过来的群聊聊天信息：" + originalMsg);
    return JSON.parse(originalMsg);// MsgBody4Group对象
  }

  /**
   * 解析群聊系统指令：“我”加群成功后通知“我”（即被加群者）（由Server发出），
   * 通知接收人可能是在创建群或群建好后邀请进入的.
   *
   * @param originalMsg
   * @return {*} 返回的是CMDBody4MyselfBeInvitedGroupResponse对象
   * ，详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/CMDBody4MyselfBeInvitedGroupResponse.html
   */
  parseResponse4GroupSysCMD4MyselfBeInvited(originalMsg) {
    console.info("!!!!!!收到服务端发过来的群聊指令be_invited：" + originalMsg);
    return JSON.parse(originalMsg);// CMDBody4MyselfBeInvitedGroupResponse对象
  }

  /**
   * 解析群聊系统指令：群聊时，向所有(除修改者)的群员通知群名被修改的通知协议内容（由Server发出），
   * 通知接收人可能是在创建群或群建好后邀请进入的.
   *
   * @param originalMsg
   * @return 返回的是CMDBody4GroupNameChangedNotification对象
   * ，详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/CMDBody4GroupNameChangedNotification.html
   */
  parseResponse4GroupSysCMD4GroupNameChanged(originalMsg) {
    console.info("!!!!!!收到服务端发过来的群聊指令gname_changed：" + originalMsg);
    return JSON.parse(originalMsg);// CMDBody4GroupNameChangedNotification对象
  }

  //*********************************************************************** （1）解析接收的消息或指令 END


  //*********************************************************************** （2）发出的消息或指令 START

  sendGroupMessage(msgType, toGid, msgContent, fn_callback) {
    console.log(toGid)
    // debugger

    var sucess = false;
    var msgBody = null;

    // 当前群组基本信息封装对象GroupEntity（
    // 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/GroupEntity.html）
    var currentChattingGe = this.groupsProviderService.getGroupInfoByGid(toGid);

    // if (!RBChatChattingContentPaneUI.send4IMCheck()) {
    //   //
    // } else
    if (!toGid) {
      //alert('消息接收者不能为空！');
      this.snackBarService.openMessage( '要发送到的群组不能为空！');
    } else if (!msgContent) {
      //alert('消息内容不能为空！');
      this.snackBarService.openMessage( '消息内容不能为空！');
    } else if (!currentChattingGe) {
      this.snackBarService.openMessage('友情提示', '您已不在该群组中，无法发送消息哦！');
    } else {
      // 消息发送者uid（就是本地用户的uid了）
      // var fromUid = this.imService.getLoginInfo().loginUserId;

      //111 设备标识 需要加
      let fromUid;
      if (this.imService.getLoginInfo().loginUserId.indexOf("web") != -1) {
        fromUid = this.imService.getLoginInfo().loginUserId.split("web")[1]
      } else if (this.imService.getLoginInfo().loginUserId.indexOf("ios") != -1) {
        fromUid = this.imService.getLoginInfo().loginUserId.split("ios")[1]
      } else {
        fromUid = this.imService.getLoginInfo().loginUserId;
      }


      // console.log(fromUid)

      var localAuthedUserInfo = this.localUserService.getObj();

      var fromNickname = localAuthedUserInfo.nickname;
      fromNickname = (fromNickname ? fromNickname : fromUid);

      // console.log(fromNickname);
      // debugger
      // 要发送的昨时聊天消息内容，实际上是一个MsgBody4Group对象
      // （详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/MsgBody4Group.html）
      msgBody = this._constructGroupChatMsgBody(msgType, fromUid, fromNickname, toGid, msgContent);
      // 构建建IM协议报文包（即Protocal对象，详见：http://docs.52im.net/extend/docs/api/mobileimsdk/server/net/openmob/mobileimsdk/server/protocal/Protocal.html）
      var p = createCommonData2(
        JSON.stringify(msgBody)  // 协议体内容
        , fromUid                // 消息发起者
        , '0'                    // 消息中转接收者（因群聊消息为扩散写逻辑，所以必须由服务端代为转发）
        , UserProtocalsType.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER);

      // console.log(p)
      // debugger
      // 将消息通过websocket发送出去
      this.imService.sendData(p);
      sucess = true;


      // 111 清空
      // $("#im-panel-inputcontent").val("")
    }

    if (fn_callback) {
      fn_callback(sucess, msgBody, currentChattingGe);
      // fn_callback(sucess, msgBody, currentChattingGe);
    }
  }

  //111 新增群消息
  sendXuAvGroupMessage(msgType, toGid, msgContent, fn_callback) {

    var sucess = false;
    var msgBody = null;

    // 当前群组基本信息封装对象GroupEntity（
    // 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/GroupEntity.html）
    var currentChattingGe = this.groupsProviderService.getGroupInfoByGid(toGid);

    // if (!RBChatChattingContentPaneUI.send4IMCheck()) {
    //   //
    // } else
    if (!toGid) {
      //alert('消息接收者不能为空！');
      this.snackBarService.openMessage( '要发送到的群组不能为空！');
    } else if (!msgContent) {
      //alert('消息内容不能为空！');
      this.snackBarService.openMessage( '消息内容不能为空！');
    } else if (!currentChattingGe) {
      this.snackBarService.openMessage('友情提示', '您已不在该群组中，无法发送消息哦！');
    } else {
      // 消息发送者uid（就是本地用户的uid了）
      var fromUid = this.imService.getLoginInfo().loginUserId;
      var localAuthedUserInfo = this.localUserService.getObj();

      var fromNickname = localAuthedUserInfo.nickname;
      fromNickname = (fromNickname ? fromNickname : fromUid);
      // 要发送的昨时聊天消息内容，实际上是一个MsgBody4Group对象
      // （详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/MsgBody4Group.html）
      msgBody = this._constructGroupChatMsgBody(msgType, fromUid, fromNickname, toGid, msgContent);
      // 构建建IM协议报文包（即Protocal对象，详见：http://docs.52im.net/extend/docs/api/mobileimsdk/server/net/openmob/mobileimsdk/server/protocal/Protocal.html）

      var p = createCommonData2(
        JSON.stringify(msgBody)  // 协议体内容
        , fromUid                // 消息发起者
        , '0'                    // 消息中转接收者（因群聊消息为扩散写逻辑，所以必须由服务端代为转发）
        , UserProtocalsType.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER);
      console.log(p);

      // 将消息通过websocket发送出去
      this.imService.sendData(p);

      sucess = true;
    }

    if (fn_callback) {
      fn_callback(sucess, msgBody, currentChattingGe);
    }
  }


  /**
   * 构造群组聊天消息协议体的 MsgBody4Group DTO对象.
   * （MsgBody4Group对象详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/MsgBody4Group.html）
   *
   * @param msgType 聊天消息类型
   * @param srcUserUid 发送方的uid
   * @param srcNickName 发送方的昵称
   * @param toGid 要发送到的群id
   * @param msg 消息内容，纯文本字串，可能是聊天文字、图片文件名或语音文件名等，但一定不是JSON字串
   * @return 返回MsgBody4Group对象，详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/MsgBody4Group.html
   */
  _constructGroupChatMsgBody(msgType, srcUserUid, srcNickName, toGid, msg) {
    // 新的MsgBody4Group对象
    var tcmd: any = {};
    tcmd.cy = ChatModeType.CHAT_TYPE_GROUP$CHAT; // 聊天模式类型：群组聊天
    tcmd.f = srcUserUid;
    tcmd.nickName = srcNickName;
    tcmd.t = toGid;
    tcmd.m = msg;
    tcmd.ty = msgType;
    //111 这个是群多端同步时要加的消息指纹，只能放到这里
    tcmd.pcTypeMsg = uuid.v1();
    return tcmd;
  }

  /**
   * 构造世界频道/普通群聊系统通知(消息)协议体的DTO对象.
   *
   * @msgType 聊天消息类型
   * @param toGid 要发送到的群id
   * @param msg 消息内容，纯文本字串，可能是聊天文字、图片文件名或语音文件名等，但一定不是JSON字串
   * @return 返回MsgBody4Group对象，详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/MsgBody4Group.html
   */
  constructGroupSystenMsgBody(toGid, msg) {
    return this._constructGroupChatMsgBody(
      MsgType.TYPE_SYSTEAM$INFO
      // 此值一定是"0"，因为是服务端发给客户端的嘛
      , "0"
      // 服务端发送的系统级消息，没昵称
      , ""
      , toGid
      , msg);
  }

  //*********************************************************************** （2）发出的消息或指令 END

}
