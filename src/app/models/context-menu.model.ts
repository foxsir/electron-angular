import ChatmsgEntityModel from "./chatmsg-entity.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import ChattingModel from "@app/models/chatting.model";
import FriendModel from "@app/models/friend.model";


// 普通消息action
type ActionType = (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => void;

// 对话列表action
type ActionChattingType = (chatting: AlarmItemInterface, chattingList: AlarmItemInterface[]) => void;

// 对话列表action
type ActionAvatarType = (alarmItem: AlarmItemInterface, chat: ChatmsgEntityModel) => void;

// 对话列表action
type ActionCollectType = () => void;

export interface BaseContextMenuModel {
  label: string;
  someLimits: string[];
  everyLimits: string[];
  action: unknown;
}

export class ContextMenuModel implements BaseContextMenuModel{
  label: string;
  someLimits: string[];
  everyLimits: string[];
  action: ActionType;
}

export class ContextMenuChattingModel implements BaseContextMenuModel{
  label: string;
  someLimits: string[];
  everyLimits: string[];
  action: ActionChattingType;
}

export class ContextMenuAvatarModel implements BaseContextMenuModel{
  label: string;
  someLimits: string[];
  everyLimits: string[];
  action: ActionAvatarType;
}

export class ContextMenuCollectModel {
  label: string;
  someLimits: string[];
  everyLimits: string[];
  action: ActionCollectType;
}
