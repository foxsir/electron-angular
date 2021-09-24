import ChattingModel from "../models/chatting.model";

export default interface AlarmItemInterface {
  // 聊天信息
  alarmItem: Partial<ChattingModel>;
  // 聊天元数据
  metadata: {
    chatType: string; // "friend" | "group"
    unread?: number; // 未读消息数
    sound?: boolean; // 声音通知
  };
}
