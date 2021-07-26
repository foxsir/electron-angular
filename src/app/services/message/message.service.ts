import {Injectable} from '@angular/core';
import RBChatUtils from "@app/libs/rbchat-utils";
import {ChatModeType, MsgType, UserProtocalsType} from "@app/config/rbchat-config";
import {SnackBarService} from "@services/snack-bar/snack-bar.service";
import {createCommonData2} from "@app/libs/mobileimsdk-client-common";
import {ImService} from "@services/im/im.service";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(
    private snackBarService: SnackBarService,
    private imService: ImService
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
        messageContentForShow = "[红包消息，请至移动端查看]";
        break;
      case MsgType.TYPE_GETREDBAG: //111 新增红包
        messageContentForShow = "["+ JSON.parse(messageContent).receiveName+"领取了"+JSON.parse(messageContent).sendName+"的红包]";
        break;
      case MsgType.TYPE_BACK: // 111 新增撤回消息样式
        messageContentForShow = JSON.parse(messageContent).msg;
        break;
      case MsgType.TYPE_TRANSFER: //111 新增消息转发消息样式
        messageContentForShow = "[合并转发]";
        break;
      case MsgType.TYPE_AITE: //111 新增消息  @
        messageContentForShow = "[有人" + JSON.parse(messageContent).content + "]";
        break;
      case MsgType.TYPE_NOTALK: //111 撤回
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

  sendMessage(msgType, friendUID, msgContent, fn_callback) {
    let sucess = false;
    let msgBody = null;

    // if (!RBChatChattingContentPaneUI.send4IMCheck()) {
    //   //
    // } else

    let p;
    if (!friendUID) {
      //alert('消息接收者不能为空！');
      this.snackBarService.openSnackBar('消息接收者不能为空！');
    } else if (!msgContent) {
      //alert('消息内容不能为空！');
      this.snackBarService.openSnackBar('消息内容不能为空！');
    } else {
      // 消息发送者uid（就是本地用户的uid了）
      // var fromUid = this.imService.getLoginInfo().loginUserId;
      //111 设备需要加web
      let fromUid = 0;
      this.imService.promiseUserInfo().then(loginInfo => {
        fromUid = loginInfo.loginUserId.split("web")[1] ?
          loginInfo.loginUserId.split("web")[1] :
          loginInfo.loginUserId;
      });

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
      p = createCommonData2(JSON.stringify(msgBody), fromUid, friendUID, UserProtocalsType.MT03_OF_CHATTING_MESSAGE);
      // console.log(msgBody)
      // 将消息通过websocket发送出去
      console.log(p);
      this.imService.sendData(p);
      sucess = true;
      //    111
      // 清空输入框
      // $("#im-panel-inputcontent").val("");
    }
    if (fn_callback) {
      //111 新增指纹码
      const fingerPrint = p.fp;
      fn_callback(sucess, msgBody, fingerPrint);
      //原版
      // fn_callback(sucess, msgBody);
    }
  }

  // 111 新增音视频消息发送
  /**
  sendAvXuMessage(msgType, friendUID, msgContent, token, Mode, Conference, fn_callback) {
    console.log(friendUID);
    let msgBody = null;
    let sucess = false;
    let fromUid = this.imService.getLoginInfo().loginUserId;
    const from_name = this.localUserService.getObj().nickname;
    const from_avatar = this.localUserService.getObj().userAvatarFileName;
    const to_name = $(".xu-chat-tit-name").text();
    const to_avatar = $(".xu-chat-tit-img").attr("src");


    try {
      if (fromUid.split("web")[1]) {
        fromUid = fromUid.split("web")[1];
      } else if (fromUid.split("ios")[1]) {
        fromUid = fromUid.split("ios")[1];
      }
    } catch (e) {

    }


    msgBody = {
      Mode: Mode,
      Conference: Conference,
      ChanId: fromUid + "-" + friendUID,
      toUserId: friendUID,
      fromUserId: fromUid,
      from_name: from_name,
      from_avatar: from_avatar,
      to_name: to_name,
      to_avatar: to_avatar,
      token: token
    };


    console.log(msgBody);

    //缓存用于音视频页面的显示名称和头像
    localStorage.setItem("openMsgid", msgBody.toUserId);
    localStorage.setItem("openMsgName", msgBody.to_name);
    //已开启窗口缓存
    localStorage.setItem("isHasChat", String(1));

    sucess = true;
    //群聊
    if (Conference === true) {
      $("#frilist").show();


      // 这是我作为发送者的事件
      UIxuRtcMobule.msgBody = msgBody;
      const uid = [];
      const toUid = $(".xu-chat-tit-img").attr("uid");
      this.restService.submitGetGroupMembersListFromServer(toUid,
        function(returnValue) {

          const arr = JSON.parse(returnValue);
          let html = '';
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].user_uid != fromUid) {


              html += '<div class="frilist_con_b">';
              html += '<img src2=' + arr[i].userAvatarFileName + ' src="' + window.RBChatConfig.HTTP_SERVER_ROOT_URL + '/UserAvatarDownloader?action=ad&user_uid=' + arr[i].userAvatarFileName + '&enforceDawnload=1&one_pixel_transparent_if_no=1&dontcache=1617428342299" class="frilist_con_b_a"/>';
              html += '<div class="frilist_con_b_b">' + arr[i].nickname + '</div>';
              html += '<input class="xu_check_list" type="checkbox" value="' + arr[i].user_uid + '">';
              html += '</div>';
            }
          }

          $("#filist").html(html);

          // debugger
          //
          //     let fid = ""
          //     for (let i = 0; i < JSON.parse(returnValue).length; i++) {
          //         if (JSON.parse(returnValue)[i].user_uid != this.localUserService.getObj().user_uid) {
          //             uid.push(JSON.parse(returnValue)[i])
          //         }
          //         if (i < JSON.parse(returnValue).length - 1) {
          //             fid = fid + JSON.parse(returnValue)[i].user_uid + ","
          //         } else {
          //             fid = fid + JSON.parse(returnValue)[i].user_uid
          //         }
          //     }
          //     msgBody.ChanId = $(".xu-chat-tit-name").attr("uid");
          //     for (let i = 0; i < uid.length; i++) {
          //         msgBody.toUserId = fid;
          //         msgBody.to_name = uid[i].nickname;
          //         msgBody.to_avatar = uid[i].userAvatarFileName;
          //         console.log(msgBody)
          //         var p = createCommonData2(JSON.stringify(msgBody), fromUid, uid[i].user_uid, msgType);
          //         this.imService.sendData(p);
          //     }
          //     UIxuRtcMobule.win = window.open("./agora/video/index.html?Conference=" + Conference + "&AppID=" + UIxuRtcMobule.AppID + "&Token=" + token + "&Channel=" + msgBody.ChanId + "&isCall=1");
          //
        },
        function(errorThrownStr) {

        }
      );


    } else {
      // 单聊
      //只有17才是通
      if (msgType == UserProtocalsType.MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$A) {


        //自己发送信息后将值赋值到 UIxuRtcMobule.msgBody  用于自己取消通话
        UIxuRtcMobule.msgBody = msgBody;
        if (Mode == 0) {
          UIxuRtcMobule.win = window.open("./agora/video/index.html?AppID=" + UIxuRtcMobule.AppID + "&Token=" + token + "&Channel=" + fromUid + "-" + friendUID + "&isCall=1");
        } else {
          UIxuRtcMobule.win = window.open("./agora/audio/index.html?AppID=" + UIxuRtcMobule.AppID + "&Token=" + token + "&Channel=" + fromUid + "-" + friendUID + "&isCall=1");
        }
        const p = createCommonData2(JSON.stringify(msgBody), fromUid, friendUID, msgType);
        this.imService.sendData(p);


      } else if (msgType == UserProtocalsType.MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$A) {
        console.log(UIxuRtcMobule.msgBody);
        //18 是发送拒绝消息
        const p = createCommonData2(JSON.stringify(UIxuRtcMobule.msgBody), fromUid, UIxuRtcMobule.msgBody.toUserId, UserProtocalsType.MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$A);
        console.log(p);
        this.imService.sendData(p);
        //关闭窗体
        localStorage.removeItem("isHasChat");
      } else if (msgType == UserProtocalsType.MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$A) {
        // debugger
        //发送占线新消息
        UIxuRtcMobule.isHasChat = localStorage.getItem("isHasChat");
        if (UIxuRtcMobule.isHasChat) {
          const p = createCommonData2(JSON.stringify(UIxuRtcMobule.msgBody), fromUid, UIxuRtcMobule.msgBody.toUserId, msgType);
          this.imService.sendData(p);
        }
      } else if (msgType == UserProtocalsType.MT53_OF_GROUP$_del) {
        // debugger
        //发送踢人消息
        UIxuRtcMobule.isHasChat = localStorage.getItem("isHasChat");
        if (UIxuRtcMobule.isHasChat) {
          const p = createCommonData2(msgContent, fromUid, msgBody.toUserId, msgType);
          this.imService.sendData(p);
        }
      }


      if (fn_callback) {
        fn_callback(sucess, msgBody);
      }
    }
  }
  **/

// --------------------------------------------------------------------------------------------------------------

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

}
