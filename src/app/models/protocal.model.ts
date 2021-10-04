/**
 * socket 推送数据协议模型
 * docs: https://www.yuque.com/docs/share/4611fce2-bc74-4708-a5dc-203677b3928d?#5LA2G
 */

export class ProtocalModelDataContent {
  cy: number; // 对应ChatType，聊天类型。比如单人聊天，群聊天
  f: number; // 消息发送方
  m: string; // 消息内容
  t: string; // 消息接收方
  ty: number; // 对应MsgType，消息类型。比如普通文本，图片消息等
  m2: string; // 设备
  nickName: string; //
  showMsg: boolean; //
  sync: string; //
  uh: string; // "http://strawberry-im.oss-cn-shenzhen.aliyuncs.com/user_portrait/400340.jpg",
  isBanned: boolean; // 全体禁言
}

export class ProtocalModel {
  QoS: boolean; // `ture = 需要服务器发送回执
  bridge: boolean;
  dataContent: string; // use JSON.parse convert ProtocalModelDataContent
  fp: string;
  from: string; // 消息发送方
  recvTime: number;
  sm: number; // 消息的时间戳
  to: string; // 消息接收方
  type: number; // 对应ProtocalType，协议类型。比如心跳包，登录包，通用数据包等
  typeu: number; // 对应UserProtocalsType，指令类型。比如一对1聊天，语音请求等
}
