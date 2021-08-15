export interface ReplyMessageType {
  duration: number;
  fileLength: number;
  fileName: string; // 文件名称
  msg: string; // 回复消息
  msgType: number; // 原消息类型
  reply: string; // 原消息
  userName: string; // 消息发送人
}
