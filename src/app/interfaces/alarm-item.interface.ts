import ChattingModel from "../models/chatting.model";

export default interface AlarmItemInterface {
  // 聊天信息
  alarmItem: ChattingModel;
  // 聊天元数据
  metadata: {
    chatType: string; // "friend" | "group"
  };
}
