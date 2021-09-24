export interface ReplyMessageType {
  duration: number;
  fileLength: number;
  fileName: string; // 文件名称
  msg: string; // 回复消息 {msgType: number; msgContent: string}
  msgType: number; // 原消息类型
  reply: string; // 原消息
  userName: string; // 消息发送人
  content: string; // 合并消息标题
  messages: ReplyMessageChildMessage[]; // 合并消息
}

export interface ReplyMessageChildMessage {
  date: number;
  sendId: string;
  sendNicName: string;
  text: string;
  type: number;
}
