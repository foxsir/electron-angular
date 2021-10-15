import {BaseEntity, Entity} from "typeorm";
// 群通用通知消息
export default class GroupCommonMessageModel extends BaseEntity{
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
}
