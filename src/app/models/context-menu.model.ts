import ChatmsgEntityModel from "./chatmsg-entity.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";


// 普通消息action
type ActionType = (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => void;

// 对话列表action
type ActionChattingType = (chatting: AlarmItemInterface, chattingList: AlarmItemInterface[]) => void;

// 对话列表action
type ActionAvatarType = () => void;

// 对话列表action
type ActionCollectType = () => void;

export class ContextMenuModel {
  label: string;
  limits: string[];
  action: ActionType;
}

export class ContextMenuChattingModel {
  label: string;
  limits: string[];
  action: ActionChattingType;
}

export class ContextMenuAvatarModel {
  label: string;
  limits: string[];
  action: ActionAvatarType;
}

export class ContextMenuCollectModel {
  label: string;
  limits: string[];
  action: ActionCollectType;
}
