/**
 * 聊天模型
 */
import {BaseEntity} from "typeorm";

export default class ChattingModel extends BaseEntity {
  alarmMessageType: number; // 0单聊 1临时聊天/陌生人聊天 2群聊
  dataId: string;
  date: number;
  isTop?: boolean = false;
  msgContent: string;
  title: string;
  avatar: string;

  /*仅本地*/
  chatType: string = 'friend'; // "friend" | "group"
  unread: number = 0; // 未读消息数
  sound: boolean = false; // 声音通知
  /*仅本地*/
}
