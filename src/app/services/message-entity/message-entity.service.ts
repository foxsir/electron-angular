import { Injectable } from '@angular/core';
import {MsgType} from "@app/config/rbchat-config";
import RBChatUtils from "@app/libs/rbchat-utils";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {LocalUserService} from "@services/local-user/local-user.service";
import {ImService} from "@services/im/im.service";

/**
 * 聊天消息内容列表中的每个单元数据封装对象（本对像仅用于聊天消息显示界面中的UI显示时，不会用作别的地方）。
 */
@Injectable({
  providedIn: 'root'
})
export class MessageEntityService {

  private localUserInfo = this.localUserService.localUserInfo;

  constructor(
    private localUserService: LocalUserService,
    private imService: ImService
  ) {}

  /**
   * 为“收到的”消息，构造聊天界面消息内客列表UI的元数据（构建而成的ChatMsgEntity对象仅用于UI显示时，别无它用）。
   *
   * @param fromUid
   * @param nickName
   * @param msg
   * @param time
   * @param msgType 聊天消息类型
   */

    // 111 新增消息指纹
  prepareRecievedMessage(fromUid, nickName, msg, time, msgType, fp = null) {
    const xu_isRead_type = true;
    // 强转聊天消息类型：js中的switch语句，在匹配时不会进行类型转换，会使用“===”的方式进行比
    // 较，请确保msgType参数传过来时必须是显示转换为int后的结果（因为服务端的http接口拉过
    // 来的数据时，msgType使用的是String类型）！
    msgType = parseInt(msgType, 10);

    // 注意：js中的switch语句，在匹配时不会进行类型转换，会使用“===”的方式进行比较，请确保msgType参数传过来时必须是显示转换为int后的结果！
    switch (msgType) {
      case MsgType.TYPE_IMAGE:
        return this.createChatMsgEntity_COME_IMAGE(fromUid, nickName, msg, time, fp, xu_isRead_type);
      case MsgType.TYPE_VOICE:
        return this.createChatMsgEntity_COME_VOICE(fromUid, nickName, msg, time, fp, xu_isRead_type);
      case MsgType.TYPE_FILE: {
        // 文件消息的内容体是FileMeta对象的JSON形式
        var fm = JSON.parse(msg);
        return this.createChatMsgEntity_COME_FILE(fm, fromUid, nickName, time, fp, xu_isRead_type);
      }
      case MsgType.TYPE_GIFT$SEND:
        return this.createChatMsgEntity_COME_GIFT$FOR$SEND(fromUid, nickName, msg, time, fp, xu_isRead_type);
      case MsgType.TYPE_GIFT$GET:
        return this.createChatMsgEntity_COME_GIFT$FOR$GET(fromUid, nickName, msg, time, fp, xu_isRead_type);
      case MsgType.TYPE_SYSTEAM$INFO:
        return this.createSystemMsgEntity_TEXT(msg, time, fp, xu_isRead_type);
      case MsgType.TYPE_SHORTVIDEO: {
        // 短视频消息的内容体是FileMeta对象的JSON形式
        return this.createChatMsgEntity_COME_SHORTVIDEO(fromUid, nickName, msg, time, fp, xu_isRead_type);
      }
      case MsgType.TYPE_CONTACT: {
        // 名片消息的内容体是ContactMeta对象的JSON形式
        const cm = JSON.parse(msg);
        const entity = this.createChatMsgEntity_COME_CONTACT(fromUid, nickName
          , cm.uid
          , cm.nickName
          , time
          , fp, xu_isRead_type);
        entity.text = msg;
        return entity;
      }
      case MsgType.TYPE_LOCATION: {
        // 位置消息的内容体是LocationMeta对象的JSON形式
        const lm = JSON.parse(msg);
        return this.createChatMsgEntity_COME_LOCATON(fromUid, nickName
          , lm != null ? lm.locationTitle : "位置"
          , lm.locationContent
          , lm != null ? lm.longitude : 0
          , lm != null ? lm.latitude : 0
          , time
          , null, fp, xu_isRead_type);
      }
      case MsgType.TYPE_REDBAG: {
        //111 新增红包
        return this.createChatMsgEntity_TO_REDBAG(fromUid, nickName, msg, time, fp, xu_isRead_type);
      }
      case MsgType.TYPE_GETREDBAG: {
        //111 新增拆红包
        return this.createChatMsgEntity_TO_GETREDBAG(fromUid, nickName, msg, time, fp, xu_isRead_type);
      }
      case MsgType.TYPE_AITE: {
        //111 新增类型 @
        const txt = JSON.parse(msg).content;
        return this.createChatMsgEntity_COME_TEXT(fromUid, nickName, txt, time, fp, xu_isRead_type);
      }
      case MsgType.TYPE_QUOTE: {
        // 回复类型
        return this.createChatMsgEntity_COME_QUOTE(fromUid, nickName, msg, time, fp, xu_isRead_type);
      }
      case MsgType.TYPE_TRANSFER: {
        // 合并转发
        return this.createChatMsgEntity_COME_TRANSFER(fromUid, nickName, msg, time, fp, xu_isRead_type);
      } case MsgType.TYPE_VOICE_CALL: {
        return this.createChatMsgEntity_COME_VOICE_CALL(fromUid, nickName, msg, time, fp, xu_isRead_type);
      } case MsgType.TYPE_NOTALK: {
        return this.createChatMsgEntity_COME_MESSAGE(fromUid, nickName, msg, time, fp, MsgType.TYPE_NOTALK);
      } default:
        return this.createChatMsgEntity_COME_TEXT(fromUid, nickName, msg, time, fp, xu_isRead_type);
    }
  }

  /**
   * 为“发出的”消息，构造聊天界面消息内客列表UI的元数据（构建而成的ChatMsgEntity对象仅用于UI显示时，别无它用）。
   *
   * @param msg
   * @param time
   * @param fingerPrint
   * @param msgType
   */
    //111 新增消息指纹和已读类型
  prepareSendedMessage(msg, time, fingerPrint, msgType, xu_isRead_type = null) {
    // console.log(parseInt(msgType, 10))
    // 强转聊天消息类型：js中的switch语句，在匹配时不会进行类型转换，会使用“===”的方式进行比
    // 较，请确保msgType参数传过来时必须是显示转换为int后的结果（因为服务端的http接口拉过
    let fm;
    // 来的数据时，msgType使用的是String类型）！
    msgType = parseInt(msgType, 10);

    let chatMsgEntityObj = null;

    switch (msgType) {
      case MsgType.TYPE_IMAGE:
        chatMsgEntityObj = this.createChatMsgEntity_TO_IMAGE(msg, time, fingerPrint, xu_isRead_type);
        break;
      case MsgType.TYPE_VOICE:
        chatMsgEntityObj = this.createChatMsgEntity_TO_VOICE(msg, time, fingerPrint, xu_isRead_type);
        break;
      case MsgType.TYPE_FILE: {
        // 文件消息的内容体是FileMeta对象的JSON形式
        fm = JSON.parse(msg);
        chatMsgEntityObj = this.createChatMsgEntity_TO_FILE(
          fm != null ? fm.fileName : ""
          , fm != null ? fm.fileMd5 : ""
          , fm != null ? fm.fileLength : 0
          , time
          , fingerPrint, xu_isRead_type);
        break;
      }
      case MsgType.TYPE_GIFT$SEND:
        chatMsgEntityObj = this.createChatMsgEntity_TO_GIFT$FOR$SEND(msg, time, fingerPrint, xu_isRead_type);
        break;
      case MsgType.TYPE_GIFT$GET:
        chatMsgEntityObj = this.createChatMsgEntity_TO_GIFT$FOR$GET(msg, time, fingerPrint, xu_isRead_type);
        break;
      case MsgType.TYPE_SYSTEAM$INFO:
        chatMsgEntityObj = this.createSystemMsgEntity_TEXT(msg, time, fingerPrint, xu_isRead_type);
        break;
      case MsgType.TYPE_SHORTVIDEO: {
        // 短视频消息的内容体是FileMeta对象的JSON形式
        chatMsgEntityObj = this.createChatMsgEntity_TO_SHORTVIDEO(msg, time, fingerPrint, xu_isRead_type);
        break;
      }
      case MsgType.TYPE_CONTACT: {
        // 名片消息的内容体是ContactMeta对象的JSON形式
        const cm = JSON.parse(msg);
        chatMsgEntityObj = this.createChatMsgEntity_TO_CONTACT(
          cm.uid
          , cm.nickName
          , time
          , fingerPrint, xu_isRead_type);
        chatMsgEntityObj.text = msg;
        break;
      }
      case MsgType.TYPE_LOCATION: {
        // 位置消息的内容体是LocationMeta对象的JSON形式
        const lm = JSON.parse(msg);
        chatMsgEntityObj = this.createChatMsgEntity_TO_LOCATION(
          lm != null ? lm.locationTitle : "位置"
          , lm.locationContent
          , lm !== null ? lm.longitude : 0
          , lm != null ? lm.latitude : 0
          , time
          , fingerPrint, xu_isRead_type
        );
        break;
      }
      //111 新增了自己发的红包
      case MsgType.TYPE_REDBAG:
        chatMsgEntityObj = this.createChatMsgEntity_TO_REDBAG(this.imService.getLoginInfo().loginUserId, this.localUserInfo.nickname, msg, time, fingerPrint);
        break;

      //111 新增了自己发的红包
      case MsgType.TYPE_GETREDBAG:
        chatMsgEntityObj = this.createChatMsgEntity_TO_GETREDBAG(this.imService.getLoginInfo().loginUserId, this.localUserInfo.nickname, msg, time, fingerPrint);
        break;

      //111 新增了 @
      case MsgType.TYPE_AITE:
        const txt = JSON.parse(msg).content;
        chatMsgEntityObj = this.createChatMsgEntity_TO_TEXT(txt, time, fingerPrint, xu_isRead_type);
        break;

      //111 新增了踢人
      case MsgType.TYPE_TIREN:
        // const txt = JSON.parse(msg).content
        console.log("!! swith----->>>>>", msg, msgType);
        const jimsg = {
          msg,
          msgType
        };
        chatMsgEntityObj = this.createChatMsgEntity_TO_TEXT(jimsg, time, fingerPrint, xu_isRead_type);
        break;
      case MsgType.TYPE_QUOTE: {
        // 回复类型
        chatMsgEntityObj = this.createChatMsgEntity_COME_QUOTE(this.imService.getLoginInfo().loginUserId, this.localUserInfo.nickname, msg, time, fingerPrint);
        break;
      }
      case MsgType.TYPE_TRANSFER: {
        // 合并转发
        chatMsgEntityObj = this.createChatMsgEntity_COME_TRANSFER(this.imService.getLoginInfo().loginUserId, this.localUserInfo.nickname, msg, time, fingerPrint);
        break;
      }
      default:
        chatMsgEntityObj = this.createChatMsgEntity_TO_TEXT(msg, time, fingerPrint, xu_isRead_type);
        break;
    }
    chatMsgEntityObj.isOutgoing = false;
    return chatMsgEntityObj;
  }

  createChatMsgEntity_TO_TEXT(message, time, fingerPrint, xu_isRead_type = null) {
    // const chatMsgEntityObj =
    // this.createChatMsgEntity_COME_TEXT(this.imService.getLoginInfo().loginUserId, this.localUserInfo.nickname, message, time, fingerPrint);
    const chatMsgEntityObj = this.createChatMsgEntity_COME_TEXT(this.localUserService.getObj().userId, this.localUserInfo.nickname, message, time, fingerPrint);
    // chatMsgEntityObj.isOutgoing = true;

    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型


    return chatMsgEntityObj;
  }

  createChatMsgEntity_TO_IMAGE(fileName, time, fingerPrint, xu_isRead_type = null) {
    const chatMsgEntityObj =
      this.createChatMsgEntity_COME_IMAGE(this.imService.getLoginInfo().loginUserId, this.localUserInfo.nickname, fileName, time, fingerPrint);
    // chatMsgEntityObj.isOutgoing = true;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型

    return chatMsgEntityObj;
  }

  createChatMsgEntity_TO_VOICE(fileName, time, fingerPrint, xu_isRead_type = null) {
    const chatMsgEntityObj =
      this.createChatMsgEntity_COME_VOICE(this.imService.getLoginInfo().loginUserId, this.localUserInfo.nickname, fileName, time, fingerPrint);
    // chatMsgEntityObj.isOutgoing = true;

    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型

    return chatMsgEntityObj;
  }

  createChatMsgEntity_TO_GIFT$FOR$SEND(giftIdent, time, fingerPrint, xu_isRead_type = null) {
    const chatMsgEntityObj = this.createChatMsgEntity_COME_GIFT$FOR$SEND(
      this.imService.getLoginInfo().loginUserId, this.localUserInfo.nickname, giftIdent, time, fingerPrint
    );
    // chatMsgEntityObj.isOutgoing = true;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型
    return chatMsgEntityObj;
  }

  createChatMsgEntity_TO_GIFT$FOR$GET(giftIdent, time, fingerPrint, xu_isRead_type = null) {
    const chatMsgEntityObj = this.createChatMsgEntity_COME_GIFT$FOR$GET(
      this.imService.getLoginInfo().loginUserId, this.localUserInfo.nickname, giftIdent, time, fingerPrint
    );
    // chatMsgEntityObj.isOutgoing = true;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型
    return chatMsgEntityObj;
  }

  createChatMsgEntity_TO_FILE(fileName, fileMd5, fileLength, time, fingerPrint, xu_isRead_type = null) {
    const msg = {
      fileName: fileName,
      fileMd5:fileMd5,
      fileLength:fileLength,
    };
    const chatMsgEntityObj = this.createChatMsgEntity_COME_FILE(msg,
      this.imService.getLoginInfo().loginUserId, this.localUserInfo.nickname, time, fingerPrint
    );
    // chatMsgEntityObj.isOutgoing = true;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型
    return chatMsgEntityObj;
  }

  createChatMsgEntity_TO_SHORTVIDEO(msg, time, fingerPrint, xu_isRead_type = null) {
    const chatMsgEntityObj = this.createChatMsgEntity_COME_SHORTVIDEO(this.imService.getLoginInfo().loginUserId, this.localUserInfo.nickname, msg, time, fingerPrint);
    // chatMsgEntityObj.isOutgoing = true;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型
    return chatMsgEntityObj;
  }

  createChatMsgEntity_TO_CONTACT(theUid, theNickName, time, fingerPrint, xu_isRead_type = null) {
    const chatMsgEntityObj = this.createChatMsgEntity_COME_CONTACT(this.imService.getLoginInfo().loginUserId, this.localUserInfo.nickname, theUid, theNickName, time, fingerPrint);
    // chatMsgEntityObj.isOutgoing = true;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型
    return chatMsgEntityObj;
  }

  createChatMsgEntity_TO_LOCATION(thLocationTitle, thLocationContent, thLongitude, thLatitude, time, fingerPrint, xu_isRead_type = null) {

    const chatMsgEntityObj = this.createChatMsgEntity_COME_LOCATON(this.imService.getLoginInfo().loginUserId, this.localUserInfo.nickname
      , thLocationTitle, thLocationContent, thLongitude, thLatitude, null
      , time, fingerPrint);
    // chatMsgEntityObj.isOutgoing = true;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型
    return chatMsgEntityObj;
  }

  createChatMsgEntity_COME_TEXT(fromUid, nickName, message, time, fingerPrint, xu_isRead_type = null) {
    // debugger
    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    chatMsgEntityObj.text = message;
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_TEXT;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型

    return chatMsgEntityObj;
  }

  createChatMsgEntity_COME_MESSAGE(fromUid, nickName, message, time, fingerPrint, msgType: number) {
    // debugger
    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    chatMsgEntityObj.text = message;
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = msgType;
    chatMsgEntityObj.xu_isRead_type = true;  //111 新增已读类型

    return chatMsgEntityObj;
  }

  // 构造回复消息
  createChatMsgEntity_COME_QUOTE(fromUid, nickName, message, time, fingerPrint, xu_isRead_type = null) {
    // debugger
    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    chatMsgEntityObj.text = message;
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_QUOTE;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  // 111 新增已读类型

    return chatMsgEntityObj;
  }

  // 构造红包
  createChatMsgEntity_TO_REDBAG(fromUid, nickName, message, time, fingerPrint, xu_isRead_type = null) {
    // debugger
    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    chatMsgEntityObj.text = message;
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_REDBAG;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  // 111 新增已读类型

    return chatMsgEntityObj;
  }

  // 构造红包
  createChatMsgEntity_TO_GETREDBAG(fromUid, nickName, message, time, fingerPrint, xu_isRead_type = null) {
    // debugger
    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    chatMsgEntityObj.text = message;
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_REDBAG;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  // 111 新增已读类型

    return chatMsgEntityObj;
  }

  // 构造合并转发
  createChatMsgEntity_COME_TRANSFER(fromUid, nickName, message, time, fingerPrint, xu_isRead_type = null) {
    // debugger
    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    chatMsgEntityObj.text = message;
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_TRANSFER;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  // 111 新增已读类型

    return chatMsgEntityObj;
  }

  createChatMsgEntity_COME_IMAGE(fromUid, nickName, fileName, time, fingerPrint, xu_isRead_type = null) {

    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    // 当是图片消息时，message里存放的就是图片所存放于服务端的文件名（原图而非缩略图的文件名哦）
    chatMsgEntityObj.text = fileName;
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_IMAGE;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型

    return chatMsgEntityObj;
  }

  createChatMsgEntity_COME_VOICE(fromUid, nickName, fileName, time, fingerPrint, xu_isRead_type = null) {

    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    // 当是图片消息时，message里存放的就是语音留言所存放于服务端的文件名
    chatMsgEntityObj.text = fileName;
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_VOICE;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型

    return chatMsgEntityObj;
  }

  createChatMsgEntity_COME_VOICE_CALL(fromUid, nickName, fileName, time, fingerPrint, xu_isRead_type = null) {
    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    // 当是图片消息时，message里存放的就是语音留言所存放于服务端的文件名
    chatMsgEntityObj.text = fileName;
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_VOICE_CALL;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型

    return chatMsgEntityObj;
  }

  createChatMsgEntity_COME_GIFT$FOR$SEND(fromUid, nickName, giftIdent, time, fingerPrint, xu_isRead_type = null) {

    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    chatMsgEntityObj.text = giftIdent;
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_GIFT$SEND;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型

    return chatMsgEntityObj;
  }

  createChatMsgEntity_COME_GIFT$FOR$GET(fromUid, nickName, giftIdent, time, fingerPrint, xu_isRead_type = null) {

    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    chatMsgEntityObj.text = giftIdent;
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_GIFT$GET;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型
    return chatMsgEntityObj;
  }

  createChatMsgEntity_COME_FILE(msg, fromUid, nickName, time, fingerPrint, xu_isRead_type = null) {

    const fileMeta = msg;

    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    chatMsgEntityObj.text = JSON.stringify(fileMeta);
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_FILE;
    chatMsgEntityObj.xu_isRead_type = xu_isRead_type;  //111 新增已读类型
    return chatMsgEntityObj;
  }

  createChatMsgEntity_COME_SHORTVIDEO(fromUid, nickName, msg, time, fingerPrint, xu_isRead_type = null) {

    const fileMeta = JSON.parse(msg);

    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    chatMsgEntityObj.text = JSON.stringify(fileMeta);
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_SHORTVIDEO;

    return chatMsgEntityObj;
  }

  createChatMsgEntity_COME_CONTACT(fromUid, nickName, theUid, theNickName, time, fingerPrint, xu_isRead_type = null) {

    const contactMeta = {
      /** 名片人员的uid */
      uid: theUid,
      /** 名片人员的昵称 */
      nickName: theNickName
    };

    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    chatMsgEntityObj.text = JSON.stringify(contactMeta);
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_CONTACT;

    return chatMsgEntityObj;
  }

  createChatMsgEntity_COME_LOCATON(fromUid, nickName
    , thLocationTitle, thLocationContent, thLongitude, thLatitude, thPrewviewImgFileName, xu_isRead_type
    , time, fingerPrint = null) {

    const locationMeta = {
      /** 位置主描述 */
      locationTitle: thLocationTitle,
      /** 位置详细描述 */
      locationContent: thLocationContent,
      /** 经度 */
      longitude: thLongitude,
      /** 纬度 */
      latitude: thLatitude,
      /** 地图预览图缓存文件名（此字段目前仅用于app产品中，对于web产品而言暂作保留字段，未实际使用之） */
      prewviewImgFileName: thPrewviewImgFileName
    };

    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = fromUid;
    chatMsgEntityObj.name = nickName;
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    chatMsgEntityObj.text = JSON.stringify(locationMeta);
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_LOCATION;

    return chatMsgEntityObj;
  }

  createSystemMsgEntity_TEXT(message, time, fingerPrint, xu_isRead_type = null) {

    const chatMsgEntityObj = new ChatmsgEntityModel();
    chatMsgEntityObj.uid = "0";
    chatMsgEntityObj.name = "";
    chatMsgEntityObj.date = time <= 0 ? RBChatUtils.getCurrentUTCTimestamp() : time;
    chatMsgEntityObj.text = message;
    chatMsgEntityObj.fingerPrintOfProtocal = fingerPrint;
    chatMsgEntityObj.msgType = MsgType.TYPE_SYSTEAM$INFO;

    return chatMsgEntityObj;
  }


}
