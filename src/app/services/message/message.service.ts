import {Injectable} from '@angular/core';
import RBChatUtils from "@app/libs/rbchat-utils";
import {ChatModeType, MsgType, UserProtocalsType} from "@app/config/rbchat-config";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {createCommonData2} from "@app/libs/mobileimsdk-client-common";
import {ImService} from "@services/im/im.service";
import * as uuid from "uuid";
import {GroupsProviderService} from "@services/groups-provider/groups-provider.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {FriendRequestModel} from "@app/models/friend-request.model";
import {FriendAddWay} from "@app/config/friend-add-way";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {CacheService} from "@services/cache/cache.service";
import {CurrentChattingChangeService} from "@services/current-chatting-change/current-chatting-change.service";
import {MessageEntityService} from "@services/message-entity/message-entity.service";

interface SendMessageResponse {
  success: boolean;
  msgBody: any;
  fingerPrint: string;
  currentChattingGe?: any;
}

const addWayItems = [
  FriendAddWay.search,
  FriendAddWay.card,
  FriendAddWay.group,
  FriendAddWay.qrcode,
] as const;
type addWayType = typeof addWayItems[number];

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(
    private snackBarService: SnackBarService,
    private imService: ImService,
    private localUserService: LocalUserService,
    private groupsProviderService: GroupsProviderService,
    private cacheService: CacheService,
    private currentChattingChangeService: CurrentChattingChangeService,
    private messageEntityService: MessageEntityService,
  ) {
  }

  /**
   * 根据消息类型，显示友好的文字内容供某些情况下的预览（比如首页”消息“列表中、系统通知等）.
   *
   * @param messageContent 真正的聊天文本内容（该内容可能是扁平文本（文本聊天消息）、文件（语音留言、图片消息）），是TextMessage中的m内容
   * @return 返回消息文本（仅用于ui显示哦）
   * @since 2.2
   */
  parseMessageForShow(messageContent, msgType) {
    // console.log(msgType)
    if (RBChatUtils.isStringEmpty(messageContent))
      {return "";}

    // 自kchat2.2(20140212)后，此字段将用于消息内容的显示
    let messageContentForShow = "";

    // 强转聊天消息类型：js中的switch语句，在匹配时不会进行类型转换，会使用“===”的方式进行比
    // 较，请确保msgType参数传过来时必须是显示转换为int后的结果（因为服务端的http接口拉过
    // 来的数据时，msgType使用的是String类型）！
    msgType = parseInt(msgType, 10);
    // debugger
    switch (msgType) {
      case MsgType.TYPE_IMAGE:
        messageContentForShow = "[图片]";
        break;
      case MsgType.TYPE_VOICE:
        messageContentForShow = "[语音]";
        break;
      case MsgType.TYPE_VOICE_CALL:
        messageContentForShow = "[语音通话]";
        break;
      case MsgType.TYPE_GIFT$SEND:
        messageContentForShow = "[收到礼物]";
        break;
      case MsgType.TYPE_GIFT$GET:
        messageContentForShow = "[能送我个礼物吗？]";
        break;
      case MsgType.TYPE_FILE:
        // 文件消息的内容体是FileMeta对象的JSON形式
        const fm = JSON.parse(messageContent);

        // FileMeta对象字段说明，请见Android或ios端工程里的FileMeta.java或FileMeta.h文件
        messageContentForShow = "[文件]" + (fm ? " " + fm.fileName : "");
        break;
      case MsgType.TYPE_SHORTVIDEO:
        messageContentForShow = "[短视频]";
        break;
      case MsgType.TYPE_CONTACT:
        messageContentForShow = "[个人名片]";
        break;
      case MsgType.TYPE_LOCATION:
        // 位置消息的内容体是LocationMeta对象的JSON形式
        const lm = JSON.parse(messageContent);
        const extra = (lm == null ? "" : (RBChatUtils.isStringEmpty(lm.locationTitle) ? "" : " " + lm.locationTitle));
        messageContentForShow = "[位置]" + extra;
        break;

      case MsgType.TYPE_REDBAG: //111 新增红包
        // messageContentForShow = "[红包消息，请至移动端查看]";
        break;
      case MsgType.TYPE_GETREDBAG: //111 新增红包
        messageContentForShow = "["+ JSON.parse(messageContent).receiveName+"领取了"+JSON.parse(messageContent).sendName+"的红包]";
        break;
      case MsgType.TYPE_BACK: // 111 新增撤回消息样式
        messageContentForShow = messageContent;
        break;
      case MsgType.TYPE_TRANSFER: //111 新增消息转发消息样式
        messageContentForShow = "[合并转发]";
        break;
      case MsgType.TYPE_AITE: //111 新增消息  @
        messageContentForShow = "[有人" + JSON.parse(messageContent).content + "]";
        break;
      case MsgType.TYPE_NOTALK: //111 禁言
        messageContentForShow = JSON.parse(messageContent).msg;
        break;
      default:
        messageContentForShow = messageContent;
        break;
    }

    return messageContentForShow;
  }


  //*********************************************************************** （1）解析接收的消息或指令 START
  /**
   * 解析由服务发过来的加好友被拒的实时信息（由服务端通知加好友发起人A）.
   *
   * <p>
   * 此场景一般是：A加B的好友请求被B拒绝了，服务器实时把此情况反馈给客户A，以便A
   * 能即时知会哦。
   *
   * @param originalMsg 服务端返回的RosterElementEntity对象的JSON文本字符串
   * @return 返回的是B的个人信息，即RosterElementEntity对象（此信息仅包含B存放在数据库中的数据，无其它在线状况信息描述），
   * 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/RosterElementEntity.html
   */
  parseProcessAdd$Friend$Req_SERVER$TO$A_REJECT_RESULTMessage(originalMsg) {
    console.info("!!!!!!收到服务端发过来的好加友被拒信息：" + originalMsg);
    return JSON.parse(originalMsg);
  }

  /**
   * 解析由服务发过来的好友个人信息.
   *
   * <p>
   * 此场景一般是：新好友已成功被添加完成，服务端将建立了好友关系的对方个人信息及时
   * 发送给本地用户（当然，前提是本地用户是在线的，否则没有必要传过来，以便能及时聊天）。
   *
   * @param originalMsg 服务端返回的RosterElementEntity对象的JSON文本字符串
   * @return 返回值为RosterElementEntity对象，
   * 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/RosterElementEntity.html
   */
  parseProcessAdd$Friend$Req_friend$Info$Server$To$ClientMessage(originalMsg) {
    console.info("!!!!!!收到服务端发过来的新好友信息：" + originalMsg);
    return JSON.parse(originalMsg);
  }

  /**
   * 解析由服务端通知在线被加好友者：收到了加好友请求.
   *
   * @param originalMsg 服务端返回的RosterElementEntity对象的JSON文本字符串
   * @return 返回值为RosterElementEntity对象，
   * 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/RosterElementEntity.html
   */
  parseAddFriendRequestInfo_server$to$b(originalMsg) {
    console.info("!!!!!!收到服务端转发的加好友请求：" + originalMsg);
    return JSON.parse(originalMsg);
  }

  /**
   * 解析由服务端反馈给加好友发起人的错误信息(出错的可能是：该好友
   * 已经存在于我的好友列表中、插入好友请求到db中时出错等)
   *
   * @param originalMsg
   * @return 错误信息（文本）
   */
  parseAddFriendRequestResponse_for$error_server$to$a(originalMsg) {
    return originalMsg;
  }

  pareseRecieveOnlineNotivication(msg) {
    // 通知内容就是这个上线用户的Uid
    const uid = msg;
    console.info("!!!!!!!!!!!!》》收到用户" + uid + "的上线通知！");
    return uid;
  }

  pareseRecieveOfflineNotivication(msg) {
    // 通知内容就是这个下线用户的Uid
    const uid = msg;
    console.info("!!!!!!!!!!!!《《收到用户" + uid + "的下线通知！");
    return uid;
  }

  //*********************************************************************** （1）解析接收的消息或指令 END


  //*********************************************************************** （2）发出的消息或指令 START
  ///**
  // * 将指定的图片消息发送给聊天中的好友.
  // */
  //function _sendPlainTextMessage(friendUID, message, fn_callback) {
  //    _sendMessage(MsgType.TYPE_TEXT, friendUID, message, fn_callback);
  //}
  //
  ///**
  // * 将指定的图片消息发送给聊天中的好友.
  // */
  //function _sendImageMessage(friendUID, imageFileName, fn_callback) {
  //    _sendMessage(MsgType.TYPE_IMAGE, friendUID, imageFileName, fn_callback);
  //}

  sendMessage(msgType, friendUID, msgContent): Promise<SendMessageResponse> {
    return new Promise((resolve, reject) => {
      let sucess = false;
      let msgBody = null;

      // if (!RBChatChattingContentPaneUI.send4IMCheck()) {
      //   //
      // } else

      if (!friendUID) {
        //alert('消息接收者不能为空！');
        this.snackBarService.openMessage('消息接收者不能为空！');
      } else if (!msgContent) {
        //alert('消息内容不能为空！');
        this.snackBarService.openMessage('消息内容不能为空！');
      } else {
        // 消息发送者uid（就是本地用户的uid了）
        // var fromUid = this.imService.getLoginInfo().loginUserId;
        this.imService.promiseUserInfo().then(loginInfo => {
          const fromUid = loginInfo.loginUserId;

          // const fromUid =
          //     this.imService.getLoginInfo().loginUserId.split("web")[1] ?
          //     this.imService.getLoginInfo().loginUserId.split("web")[1] :
          //     this.imService.getLoginInfo().loginUserId;

          // console.log(this.imService.getLoginInfo().loginUserId.split("web"))
          // console.log(fromUid)
          // debugger

          // 要发送的聊天消息内容，实际上是一个MsgBody4Friend对象
          // （详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/MsgBody4Friend.html）
          msgBody = this.constructFriendChatMsgBody(fromUid, friendUID, msgContent, msgType);
          // 构建建IM协议报文包（即Protocal对象，
          // 详见：http://docs.52im.net/extend/docs/api/mobileimsdk/server/net/openmob/mobileimsdk/server/protocal/Protocal.html）
          const p: any = createCommonData2(JSON.stringify(msgBody), fromUid, friendUID, UserProtocalsType.MT03_OF_CHATTING_MESSAGE);
          // 将消息通过websocket发送出去
          p.QoS = true; // 需要质量保证


          const message = msgBody.m;
          const chatMsgEntity: ChatmsgEntityModel = this.messageEntityService.prepareSendedMessage(
            message, new Date().getTime(), p.fp, msgType
          );
          chatMsgEntity.uh = this.localUserService.localUserInfo.userAvatarFileName;
          this.cacheService.putChattingCache(this.currentChattingChangeService.currentChatting, chatMsgEntity, true).then(() => {
            this.imService.sendData(p);
            sucess = true;

            resolve({
              success: sucess,
              msgBody: msgBody,
              fingerPrint: p.fp,
            });
          });
        });
      }
    });
  }


  sendGroupMessage(msgType, toGid, msgContent, userIds: string[] = []): Promise<SendMessageResponse> {
    return new Promise((resolve, reject) => {
      let atTargetMember = null;
      if(userIds.length > 0) {
        atTargetMember = userIds.filter(
          (item, index) => userIds.indexOf(item) === index
        );
        msgContent = JSON.stringify({
          content: msgContent,
          userIds: atTargetMember,
        });
        msgType = MsgType.TYPE_AITE;
      }

      console.log(toGid);
      // debugger

      let success = false;
      let msgBody = null;

      // 当前群组基本信息封装对象GroupEntity（
      // 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/GroupEntity.html）
      // 检查是否是群成员
      const currentChattingGe = this.groupsProviderService.getGroupInfoByGid(toGid);


      // 消息发送者uid（就是本地用户的uid了）
      // var fromUid = IMSDK.getLoginInfo().loginUserId;

      const fromUid = this.imService.getLoginInfo().loginUserId;

      // console.log(fromUid)

      const localAuthedUserInfo = this.localUserService.getObj();

      let fromNickname = localAuthedUserInfo.nickname;
      fromNickname = (fromNickname ? fromNickname : fromUid);

      // console.log(fromNickname);
      // debugger
      // 要发送的昨时聊天消息内容，实际上是一个MsgBody4Group对象
      // （详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/MsgBody4Group.html）
      msgBody = this.constructGroupChatMsgBody(msgType, fromUid, fromNickname, toGid, msgContent);
      // 构建建IM协议报文包（即Protocal对象，详见：
      // http://docs.52im.net/extend/docs/api/mobileimsdk/server/net/openmob/mobileimsdk/server/protocal/Protocal.html）
      const p: any = createCommonData2(
        JSON.stringify(msgBody)  // 协议体内容
        , fromUid                // 消息发起者
        , '0'                    // 消息中转接收者（因群聊消息为扩散写逻辑，所以必须由服务端代为转发）
        , UserProtocalsType.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER);

      // console.log(p)
      // debugger
      // 将消息通过websocket发送出去
      p.QoS = true;
      this.imService.sendData(p);
      success = true;

      resolve({
        success: success,
        msgBody:msgBody,
        currentChattingGe: currentChattingGe,
        fingerPrint: p.fp,
      });
    });
  }


  /**
   * 构造好友聊天消息协议体的 MsgBody4Friend DTO对象.
   * （MsgBody4Friendt对象详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/im/dto/MsgBody4Friend.html）
   *
   * @msgType 聊天消息类型
   * @param f 发送方的uid
   * @param t 发发送到的群id
   * @param m 消息内容，纯文本字串，可能是聊天文字、图片文件名或语音文件名等，但一定不是JSON字串
   * @param ty 聊天消息类型
   * @return
   */
  constructFriendChatMsgBody(f, t, m, ty) {
    // 新的 MsgBody4Friend 对象
    return {
      cy: ChatModeType.CHAT_TYPE_FRIEND$CHAT, // 聊天模式类型：一对一好友聊天
      f: f,
      t: t,
      m: m,
      ty: ty,
    };
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
  constructGroupChatMsgBody(msgType, srcUserUid, srcNickName, toGid, msg) {
    // 新的MsgBody4Group对象
    const tcmd = {
      cy: ChatModeType.CHAT_TYPE_GROUP$CHAT, // 聊天模式类型：群组聊天
      f: srcUserUid,
      nickName: srcNickName,
      t: toGid,
      m: msg,
      ty: msgType,
      //111 这个是群多端同步时要加的消息指纹，只能放到这里
      pcTypeMsg: uuid.v1(),
    };
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
    return this.constructGroupChatMsgBody(
      MsgType.TYPE_SYSTEAM$INFO
      // 此值一定是"0"，因为是服务端发给客户端的嘛
      , "0"
      // 服务端发送的系统级消息，没昵称
      , ""
      , toGid
      , msg);
  }

  /**
   * 同意或者拒绝好友添加请求
   * @param type
   * @param req
   */
  friendRequest(type: 'ok' | 'cancel', req: FriendRequestModel): Promise<SendMessageResponse> {
    return new Promise((resolve, reject) => {
      const localUserInfo = this.localUserService.localUserInfo;
      let success = false;
      const msgBody = {
        localUserNickName: req.reqUserNickname,
        localUserUid: localUserInfo.userId,
        srcUserUid: req.reqUserId
      };

      const typeU = {
        ok: UserProtocalsType.MT08_OF_PROCESS_ADD$FRIEND$REQ_B$TO$SERVER_AGREE,
        cancel: UserProtocalsType.MT09_OF_PROCESS_ADD$FRIEND$REQ_B$TO$SERVER_REJECT
      };

      const p: any = createCommonData2(JSON.stringify(msgBody), localUserInfo.userId, 0, typeU[type]);
      p.bridge = false;
      p.QoS = true;
      this.imService.sendData(p);
      success = true;

      resolve({
        success: success,
        msgBody:msgBody,
        fingerPrint: p.fp,
      });
    });
  }

  /**
   * 发送添加好友指令
   * @param addWay
   * @param friend
   */
  addFriend(addWay: addWayType, friend: {friendUserUid: number; desc: string}): Promise<SendMessageResponse> {
    return new Promise((resolve, reject) => {
      const localUserInfo = this.localUserService.localUserInfo;
      let success = false;
      const msgBody = {
        desc: friend.desc,
        friendUserUid: friend.friendUserUid,
        localUserUid: localUserInfo.userId,
        addWay: addWay // 1搜索添加  3名片 4群组  5二维码
      };

      const p: any = createCommonData2(
        JSON.stringify(msgBody), localUserInfo.userId, 0, UserProtocalsType.MT05_OF_ADD_FRIEND_REQUEST_A$TO$SERVER
      );
      p.bridge = false;
      p.QoS = true;
      this.imService.sendData(p);
      success = true;

      resolve({
        success: success,
        msgBody:msgBody,
        fingerPrint: p.fp,
      });
    });
  }

  /**
   * 撤回单聊消息
   * @param currentChat
   * @param chat
   */
  backFriendMessage(currentChat: AlarmItemInterface, chat: ChatmsgEntityModel): Promise<SendMessageResponse> {
    // 单聊 "{"sendId":"400340","msg":"foxsir撤回了我的一条消息","uuid":"AD8B64D1-4E77-46B8-A290-C6BAA0BEFD3C"}"
    // 群聊 {"sendId":"400340","msg":"foxsir撤回了foxsir的一条消息","adminId":"400340,400070,400340","uuid":"9827078A-C7F1-4EAD-AE87-FE3FF16A5603"}
    return new Promise((resolve, reject) => {
      const localUserInfo = this.localUserService.localUserInfo;
      let success = false;
      let adminId = {};
      if (currentChat.metadata.chatType === 'group') {
        adminId = {
          adminId: "400340,400070,400340",
        };
      }

      const msgBody = {
        cy: currentChat.metadata.chatType === 'group' ? ChatModeType.CHAT_TYPE_GROUP$CHAT : ChatModeType.CHAT_TYPE_FRIEND$CHAT,
        f: localUserInfo.userId,
        m: JSON.stringify({
          isBanned: false,
          showMsg: false,
          senderId: localUserInfo.userId.toString(),
          msg: localUserInfo.nickname + "撤回了我的一条消息",
          uuid: chat.fingerPrintOfProtocal,
          ...adminId
        }),
        m3: "web",
        nickName: localUserInfo.nickname,
        t: currentChat.alarmItem.dataId,
        ty: MsgType.TYPE_BACK,
      };

      const typeu = currentChat.metadata.chatType === 'group' ?
        UserProtocalsType.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B :
        UserProtocalsType.MT03_OF_CHATTING_MESSAGE;

      const p: any = createCommonData2(
        JSON.stringify(msgBody), localUserInfo.userId, currentChat.alarmItem.dataId, typeu
      );
      p.bridge = false;
      p.QoS = true;

      // console.dir("msgBody")
      // console.dir(p)
      // console.dir(msgBody)
      // console.dir("msgBody")
      this.imService.sendData(p);
      success = true;

      resolve({
        success: success,
        msgBody:msgBody,
        fingerPrint: p.fp,
      });
    });
  }

  /**
   * 撤回群聊消息
   * @param currentChat
   * @param chat
   */
  backGroupMessage(currentChat: AlarmItemInterface, chat: ChatmsgEntityModel): Promise<SendMessageResponse> {
    // 单聊 "{"sendId":"400340","msg":"foxsir撤回了我的一条消息","uuid":"AD8B64D1-4E77-46B8-A290-C6BAA0BEFD3C"}"
    // 群聊 {"sendId":"400340","msg":"foxsir撤回了foxsir的一条消息","adminId":"400340,400070,400340","uuid":"9827078A-C7F1-4EAD-AE87-FE3FF16A5603"}
    return new Promise((resolve, reject) => {
      const localUserInfo = this.localUserService.localUserInfo;
      let success = false;
      let adminId = {};
      if (currentChat.metadata.chatType === 'group') {
        adminId = {
          adminId: "400070,400340",
        };
      }

      const msgBody = {
        cy: ChatModeType.CHAT_TYPE_GROUP$CHAT,
        f: localUserInfo.userId.toString(),
        m: JSON.stringify({
          isBanned: false,
          showMsg: false,
          senderId: currentChat.alarmItem.dataId.toString(),
          msg: "普通管理员撤回了我的一条消息",
          uuid: chat.fingerPrintOfProtocal,
          adminId: adminId
        }),
        m3: "web",
        nickName: "普通管理员",
        t: currentChat.alarmItem.dataId,
        ty: MsgType.TYPE_BACK,
      };

      const p: any = createCommonData2(
        JSON.stringify(msgBody), localUserInfo.userId.toString(), "0", UserProtocalsType.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER
      );
      p.bridge = false;
      p.QoS = true;

      this.imService.sendData(p);
      success = true;

      resolve({
        success: success,
        msgBody:msgBody,
        fingerPrint: p.fp,
      });
    });
  }

    /**
     * 自定义消息
     * @param currentChat
     * @param chat
     */
    sendCustomerMessage(msgBody): Promise<SendMessageResponse> {
        console.log('发送自定义消息：', msgBody);

        return new Promise((resolve, reject) => {
            const localUserInfo = this.localUserService.localUserInfo;
            //let p = JSON.stringify(msgBody);
            msgBody.QoS = true;
            this.imService.sendData(msgBody);

            resolve({
                success: true,
                msgBody: msgBody,
                fingerPrint: '',
            });
        });
    }

  alreadyRead(to: string, chatType: string) {
    const localUserInfo = this.localUserService.localUserInfo;
    const msgBody = {
      cy: 0,
      f: localUserInfo.userId,
      m: "已读",
      m3: "web",
      t: to,
      ty: MsgType.TYPE_READED
    };
    const typeu = chatType === 'friend' ? UserProtocalsType.MT03_OF_CHATTING_MESSAGE : UserProtocalsType.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER
    const p: any = createCommonData2(
      JSON.stringify(msgBody), localUserInfo.userId.toString(), to, typeu
    );

    p.QoS = true;
    p.bridge = false;
    this.imService.sendData(p);
  }


}
