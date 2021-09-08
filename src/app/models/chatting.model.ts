/**
 * 聊天模型
 */
export default class ChattingModel {
  alarmMessageType: number; // 0单聊 1临时聊天/陌生人聊天 2群聊
  dataId: string;
  date: string;
  isTop: boolean;
  msgContent: string;
  title: string;
  avatar: string;
}
