import ChattingModel from "../models/chatting.model";

export default interface AlarmItemInterface {
  // 聊天信息
  alarmItem: ChattingModel;
  // 聊天元数据
  metadata: {
    msgType: number; // 0=单聊 1=临时聊天/陌生人聊天  2=群聊
  };
}
