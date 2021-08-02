/*
 * Copyright (C) 2021  即时通讯网(52im.net) & Jack Jiang.
 * The MobileIMSDK_H5（MobileIMSDK的标准HTML5版客户端） Project. All rights reserved.
 *
 * 【本产品为著作权产品，请在授权范围内放心使用，禁止外传！】
 *
 * 【本系列产品在国家版权局的著作权登记信息如下】：
 * 1）国家版权局登记名（简称）和证书号：RainbowChat（软著登字第1220494号）
 * 2）国家版权局登记名（简称）和证书号：RainbowChat-Web（软著登字第3743440号）
 * 3）国家版权局登记名（简称）和证书号：RainbowAV（软著登字第2262004号）
 * 4）国家版权局登记名（简称）和证书号：MobileIMSDK-Web（软著登字第2262073号）
 * 5）国家版权局登记名（简称）和证书号：MobileIMSDK（软著登字第1220581号）
 * 著作权所有人：江顺/苏州网际时代信息科技有限公司
 *
 * 【违法或违规使用投诉和举报方式】：
 * 联系邮件：jack.jiang@52im.net
 * 联系微信：hellojackjiang
 * 联系QQ：413980957
 * 官方社区：http://www.52im.net
 */

/**
 * MobileIMSDK核心框架级的协议类型.
 * <p>
 * 这些协议类型由框架算法决定其意义和用途，不建议用户自行使用，用户
 * 自定义协议类型请参见 {@link Protocal} 类中的 typeu 字段。
 *
 * 可参考API文档：http://docs.52im.net/extend/docs/api/mobileimsdk/server_tcp/net/x52im/mobileimsdk/server/protocal/Protocal.html
 */
export const MBProtocalType = {

  //------------------------------------------------- from client
  /* 由客户端发出 - 协议类型：客户端登陆 */
  FROM_CLIENT_TYPE_OF_LOGIN: 0,
  /* 由客户端发出 - 协议类型：心跳包 */
  FROM_CLIENT_TYPE_OF_KEEP$ALIVE: 1,
  /* 由客户端发出 - 协议类型：发送通用数据 */
  FROM_CLIENT_TYPE_OF_COMMON$DATA: 2,
  /* 由客户端发出 - 协议类型：客户端退出登陆 */
  FROM_CLIENT_TYPE_OF_LOGOUT: 3,
  /* 由客户端发出 - 协议类型：QoS保证机制中的消息应答包（目前只支持客户端间的QoS机制哦） */
  FROM_CLIENT_TYPE_OF_RECIVED: 4,
  /* 由客户端发出 - 协议类型：C2S时的回显指令（此指令目前仅用于测试时） */
  FROM_CLIENT_TYPE_OF_ECHO: 5,

  //------------------------------------------------- from server
  /* 由服务端发出 - 协议类型：响应客户端的登陆 */
  FROM_SERVER_TYPE_OF_RESPONSE$LOGIN: 50,
  /* 由服务端发出 - 协议类型：响应客户端的心跳包 */
  FROM_SERVER_TYPE_OF_RESPONSE$KEEP$ALIVE: 51,
  /* 由服务端发出 - 协议类型：反馈给客户端的错误信息 */
  FROM_SERVER_TYPE_OF_RESPONSE$FOR$ERROR: 52,
  /* 由服务端发出 - 协议类型：反馈回显指令给客户端 */
  FROM_SERVER_TYPE_OF_RESPONSE$ECHO: 53,
  /* 由服务端发出 - 协议类型：向客户端发出“重复登陆被踢”指令 */
  FROM_SERVER_TYPE_OF_KICKOUT: 54
};

/**
 * 错误码常量表.<br>
 * <b>建议0~1024范围内的错误码作为MobileIMSDK核心框架保留，业务层请使用>1024的码表示！</b>
 */
export const MBErrorCode = {

  /* 一切正常 */
  COMMON_CODE_OK: 0,
  /* 客户端尚未登陆 */
  COMMON_NO_LOGIN: 1,
  /* 未知错误 */
  COMMON_UNKNOW_ERROR: 2,
  /* 数据发送失败 */
  COMMON_DATA_SEND_FAILD: 3,
  /* 无效的 {@link Protocal}对象 */
  COMMON_INVALID_PROTOCAL: 4,

  //------------------------------------------------- 由客户端产生的错误码
  /* 与服务端的连接已断开 */
  BREOKEN_CONNECT_TO_SERVER: 201,
  /* 与服务端的网络连接失败 */
  BAD_CONNECT_TO_SERVER: 202,
  /* 客户端SDK尚未初始化 */
  CLIENT_SDK_NO_INITIALED: 203,
  /* 本地网络不可用（未打开） */
  LOCAL_NETWORK_NOT_WORKING: 204,
  /* 要连接的服务端网络参数未设置 */
  TO_SERVER_NET_INFO_NOT_SETUP: 205,

  //------------------------------------------------- 由服务端产生的错误码
  /* 客户端尚未登陆，请重新登陆 */
  RESPONSE_FOR_UNLOGIN: 301
};

/**
 * Socket事件名定义。
 *
 * MobileIMSDK H5版客户端框架中，各种网络事件是通过事件通知的方法抛出，从而与主逻辑解耦，
 * 机制上与Andriod端的机制EventBus类似，与socket.io中的实现思路是一致的。
 */
export const MBSocketEvent = {

  // SOCKET_EVENT_COMMON$DATA      : "s_evt.commondate",
  // SOCKET_EVENT_DUPLICATED       :"s_evt.duplicated",
  // SOCKET_EVENT_ILLEGAL          : "s_evt.illegal",

  SOCKET_EVENT_ON_LOGIN_RESPONSE: "onLoginResponse",
  SOCKET_EVENT_ON_LINK_CLOSE: "onLinkClose",

  SOCKET_EVENT_ON_RECIEVE_MESSAGE: "onRecieveMessage",
  SOCKET_EVENT_ON_ERROR_RESPONSE: "onErrorResponse",

  SOCKET_EVENT_MESSAGE_LOST: "messagesLost",
  SOCKET_EVENT_MESSAGE_BE_RECIEVED: "messagesBeReceived",

  SOCKET_EVENT_RECONNECT_ATTEMPT: "reconnect_attempt",

  /* 网络事件：心跳包（客户端发出的） */
  SOCKET_EVENT_PING: "ping",
  /* 网络事件：心跳包（客户端收到的） */
  SOCKET_EVENT_PONG: "pong",

  /* 网络事件：客户端已被强行踢出 */
  SOCKET_EVENT_KICKOUT: "kickout"
};

/**
 * 被踢原因编码常量。
 */
export const MBKickoutCode = {
  /* 被踢原因编码：因重复登陆被踢 */
  KICKOUT_FOR_DUPLICATE_LOGIN: 1,
  /* 被踢原因编码：被管理员强行踢出 */
  KICKOUT_FOR_ADMIN: 2
};

/**
 * MobileIMSDK核心框架预设的敏感度模式.
 *
 * <p>
 * 对于客户端而言，此模式决定了用户与服务端网络会话的健康模式，原则上超敏感客户端的体验越好。
 *
 * <p>
 * <b>重要说明：</b><u>客户端本模式的设定必须要与服务端的模式设制保持一致</u>，否则可能因参数的不一致而导致
 * IM算法的不匹配，进而出现不可预知的问题。
 *
 * @author Jack Jiang
 */
export const MBSenseMode = {

  /*
   * 此模式下：<br>
   * - KeepAlive心跳问隔为3秒；<br>
   * - 5秒后未收到服务端心跳反馈即认为连接已断开（相当于连续1个心跳间隔+5秒链路延迟容忍时间后仍未收到服务端反馈）。
   */
  MODE_3S: 1,

  /*
   * 此模式下：<br>
   * - KeepAlive心跳问隔为10秒；<br>
   * - 15秒后未收到服务端心跳反馈即认为连接已断开（相当于连续1个心跳间隔+5秒链路延迟容忍时间后仍未收到服务端反馈）。
   */
  MODE_10S: 2,

  /*
   * 此模式下：<br>
   * - KeepAlive心跳问隔为15秒；<br>
   * - 20秒后未收到服务端心跳反馈即认为连接已断开（相当于连续1个心跳间隔+5秒链路延迟容忍时间后仍未收到服务端反馈）。
   */
  MODE_15S: 3,

  /*
   * 此模式下：<br>
   * - KeepAlive心跳问隔为30秒；<br>
   * - 35秒后未收到服务端心跳反馈即认为连接已断开（相当于连续1个心跳间隔+5秒链路延迟容忍时间后仍未收到服务端反馈）。
   */
  MODE_30S: 4,

  /*
   * 此模式下：<br>
   * - KeepAlive心跳问隔为60秒；<br>
   * - 65秒后未收到服务端心跳反馈即认为连接已断开（相当于连续1个心跳间隔+5秒链路延迟容忍时间后仍未收到服务端反馈）。
   */
  MODE_60S: 5,

  /*
   * 此模式下：<br>
   * - KeepAlive心跳问隔为120秒；<br>
   * - 125秒后未收到服务端心跳反馈即认为连接已断开（相当于连续1个心跳间隔+5秒链路延迟容忍时间后仍未收到服务端反馈）。
   */
  MODE_120S: 6
};
