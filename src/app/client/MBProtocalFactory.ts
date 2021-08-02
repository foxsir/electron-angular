import {MBProtocalType} from "./mb_constants";
import * as uuid from "uuid";

/**
 * ======================================================================
 * 定义一个Protocal类.
 *
 * 【基本说明】：
 * 此类是MobileIMSDK的通信协议报文封装对象，MobileIMSDK的全部客户端和服务端都遵从这个协议格式。
 * ======================================================================
 */
  // 构造器（相当于java里的构造方法）
class Protocal {

  /*
   * 意义：协议类型。
   * 注意：本字段为框架专用字段，本字段的使用涉及IM核心层算法的表现，如无必要请避免应用层使用此字段。
   * 补充：理论上应用层不参与本字段的定义，可将其视为透明，如需定义应用层的消息类型，请使用typeu字
   *       段并配合dataContent一起使用。
   * */
  type = 0;

  /*
   * 意义：协议数据内容。
   * 说明：本字段用于MobileIMSDK_X框架中时，可能会存放一些指令内容。当本字段用于应用层时，由用户自行
   *      定义和使用其内容。
   * */
  dataContent = null;

  /*
   * 意义：消息发出方的id（当用户登陆时，此值可不设置）
   * 说明：为“-1”表示未设定、为“0”表示来自Server。
   * */
  from = "-1";

  /*
   * 意义：消息接收方的id（当用户退出时，此值可不设置）
   * 说明：为“-1”表示未设定、为“0”表示发给Server。
   * */
  to = "-1";

  /*
   * 意义：用于消息的指纹特征码（理论上全局唯一）.
   * 注意：本字段为框架专用字段，请勿用作其它用途。
   * */
  fp = null;

  /*
   * 意义：true表示本包需要进行QoS质量保证，否则不需要.<br>
   * 默认：false */
  QoS = false;

  /*
   * 意义：应用层专用字段——用于应用层存放聊天、推送等场景下的消息类型。
   * 注意：此值为-1时表示未定义。MobileIMSDK_X框架中，本字段为保留字段，不参与框架的核心算法，专留用应用
   *      层自行定义和使用。
   * */
  typeu = -1;

  /* 本字段仅用于客户端QoS逻辑时（表示丢包重试次数），本字段不用于网络传输时！ */
  retryCount = 0;
}


/**
 * MibileIMSDK框架H5版客户端的协议工厂类。
 * <p>
 * 理论上这些协议都是框架内部要用到的，应用上层可以无需理解和理会之。
 *
 * @author Jack Jiang(http://www.52im.net/thread-2792-1-1.html)
 */
export default class MBProtocalFactory {

  // 构造器（相当于java里的构造方法）
  constructor() {
  }

  /**
   * 创建Protocal对象的方法。
   *
   * @param type {int} 协议类型
   * @param dataContent {String} 协议数据内容
   * @param from {String} 消息发出方的id（当用户登陆时，此值可不设置）
   * @param to {String} 消息接收方的id（当用户退出时，此值可不设置）
   * @param QoS {boolean} 是否需要QoS支持，true表示是，否则不需要
   * @param fingerPrint {String} 协议包的指纹特征码，当 QoS字段=true时且本字段为null时方法中将自动生成指纹码否则使用本参数指定的指纹码
   * @param typeu {int} 应用层专用字段——用于应用层存放聊天、推送等场景下的消息类型，不需要设置时请填-1即可
   * @return {Protocal}
   */
  createProtocal(type, dataContent, from, to
    , QoS, fingerPrint, typeu) {

    var p = new Protocal();

    p.type = type;
    p.dataContent = dataContent;
    p.from = from;
    p.to = to;
    p.typeu = typeu;

    p.QoS = QoS;
    // 只有在需要QoS支持时才生成指纹，否则浪费数据传输流量
    // 目前一个包的指纹只在对象建立时创建哦
    if (QoS) {
      p.fp = (fingerPrint ? fingerPrint : uuid.v1());
    }

    return p;
  }

  /**
   * 此方法的存在，仅是为了方便兼容基于MobileIMSDK-Web框架的应用层代码。
   *
   * @see #createProtocal()
   */
  createCommonData4(dataContent, from_user_id, to_user_id, typeu
                    // , msgTime
    , fingerPrint, QoS) {

    return this.createProtocal(MBProtocalType.FROM_CLIENT_TYPE_OF_COMMON$DATA, dataContent
      , from_user_id, to_user_id, QoS, fingerPrint, typeu);

    // var p = new Protocal();
    // p.type = MBProtocalType.FROM_CLIENT_TYPE_OF_COMMON$DATA; //C_IMEVT_COMMON$DATA
    // p.dataContent = dataContent;
    // p.from = from_user_id;
    // p.to = to_user_id;
    // p.typeu = typeu;
    // // p.msgTime = msgTime;
    // p.QoS = QoS;
    // p.fp = (fingerPrint ? fingerPrint : uuid.v1());
    //
    // return p;

    // return {type:
    //     , from:from_user_id
    //     , to:to_user_id
    //     , dataContent:dataContent
    //     // 20160921后启动uuid生成， uuid对象由uuid.js文件中代码定义，uuid生成可兼容IE7及以上浏览器（IE6未测试过）
    //     , fp:(fingerPrint ? fingerPrint : uuid.v1())
    //     , typeu: typeu // add by Jack Jiang at 20161122
    //     , msgTime: msgTime
    // };
  }

  // /**
  //  * 增加了msgTime字段的通用Protocal对象创建函数。
  //  *
  //  * @param dataContent 要发送的数据内容
  //  * @param from_user_id 消息发送者uid
  //  * @param to_user_id 消息接收者uid
  //  * @param typeu 应用层专用字段——用于应用层存放聊天、推送等场景下的消息类型。注意：此值为-1时表示未定义。
  //  *              MobileIMSDK_Web框架中，本字段为保留字段，不参与框架的核心算法，专留用应用层自行定义和使用。
  //  * @param msgTime 消息的了出时间，本字段目前用于聊天消息记录时，可为空
  //  * @returns {{type: string, from: *, to: *, dataContent: *, fp: *, typu: *}}
  //  * @see mobile-im-sdk/protocal.js
  //  */
  // createCommonData3(dataContent, from_user_id, to_user_id, typeu, msgTime){
  //     return createCommonData4(dataContent, from_user_id, to_user_id, typeu, msgTime, null)
  // };

  /**
   * 此方法的存在，仅是为了方便兼容基于MobileIMSDK-Web框架的应用层代码。
   *
   * @see #createProtocal()
   */
  createCommonData2(dataContent, from_user_id, to_user_id, typeu) {
    return this.createCommonData4(dataContent, from_user_id, to_user_id, typeu, null, true);
  }

  /**
   * 创建用户心跳包报文对象（该对象由客户端发出）.
   * <p>
   * <b>本方法主要由MobileIMSDK框架内部使用。</b>
   *
   * @param from_user_id {String} 消息接收者uid
   * @return {Protocal}
   */
  createPKeepAlive(from_user_id) {
    return this.createProtocal(MBProtocalType.FROM_CLIENT_TYPE_OF_KEEP$ALIVE
      , "{}", from_user_id, "0", false, null, -1);
  }

  /**
   * 创建用户注消登陆消息报文对象（该对象由客户端发出）.
   * <p>
   * <b>本方法主要由MobileIMSDK框架内部使用。</b>
   *
   * @param user_id {String} 消息接收者uid
   * @return {Protocal}
   */
  createPLoginoutInfo(user_id) {
    return this.createProtocal(MBProtocalType.FROM_CLIENT_TYPE_OF_LOGOUT
      , null, user_id, "0", false, null, -1);
  }

  /**
   * 创建用户登陆消息报文对象（该对象由客户端发出）.
   * <p>
   * <b>本方法主要由MobileIMSDK框架内部使用。</b>
   *
   * @param userId {String} 传递过来的准一id，保证唯一就可以通信，可能是登陆用户名、也可能是任意不重复的id等，具体意义由业务层决定
   * @param token {String} 用于身份鉴别和合法性检查的token，它可能是登陆密码，也可能是通过前置单点登陆接口拿到的token等，具体意义由业务层决定
   * @param extra {String} 额外信息字符串。本字段目前为保留字段，供上层应用自行放置需要的内容
   * @return {Protocal}
   */
  createPLoginInfo(userId, loginInfo) {

    // var loginInfo = {
    //     loginUserId : userId,
    //     loginToken  : token,
    //     extra       : extra
    // };

    // 因登陆额外处理丢包逻辑，所以此包也无需QoS支持。不能支持QoS的原因
    // 是：登陆时QoS机制都还没启用呢（只在登陆成功后启用），所以此处无需设置且设置了也没有用的哦
    return this.createProtocal(MBProtocalType.FROM_CLIENT_TYPE_OF_LOGIN
      , JSON.stringify(loginInfo), userId, "0", false, null, -1);
  }

  /**
   * 客户端from_user_id向to_user_id发送一个QoS机制中需要的“收到消息应答包”(默认bridge标认为false).
   * <p>
   * <b>本方法主要由MobileIMSDK框架内部使用。</b>
   *
   * @param from_user_id {String} 发起方
   * @param to_user_id {String} 接收方
   * @param recievedMessageFingerPrint {String} 已收到的消息包指纹码
   * @return
   */
  createRecivedBack(from_user_id, to_user_id, recievedMessageFingerPrint) {
    return this.createProtocal(MBProtocalType.FROM_CLIENT_TYPE_OF_RECIVED
      , recievedMessageFingerPrint, from_user_id, to_user_id, false, null, -1);
  }
}

