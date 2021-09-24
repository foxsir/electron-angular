import ChatmsgEntityModel from "./chatmsg-entity.model";
import AlarmItemInterface from "../interfaces/alarm-item.interface";
import FriendModel from "./friend.model";
import {GroupAdminModel} from "./group-admin.model";
import {GroupModel} from "./group.model";

// 普通消息action
type ActionType = (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => void;

// 对话列表action
type ActionChattingType = (chatting: AlarmItemInterface) => void;

// 对话列表action
type ActionAvatarType = (alarmItem: AlarmItemInterface, chat: ChatmsgEntityModel) => void;

type ActionVisibilityForGroupAvatar = (filterData: Partial<MenuFilterData>) => boolean;

type ActionVisibilityForChatting = (filterData: Partial<MenuFilterData>) => boolean;

// 对话列表action
type ActionCollectType = () => void;

export interface MenuFilterData {
  admins: GroupAdminModel[] | any;
  friends: FriendModel[] | any;
  groups: GroupModel[] | any;
  alarmItem: AlarmItemInterface;
  chat: ChatmsgEntityModel;
}

export interface BaseContextMenuModel {
  label: string;
  visibility: ActionVisibilityForGroupAvatar;
  action: unknown;
}

export class ContextMenuModel implements BaseContextMenuModel{
  label: string;
  visibility: ActionVisibilityForGroupAvatar;
  action: ActionType;
}

export class ContextMenuChattingModel implements BaseContextMenuModel{
  label: string;
  visibility: ActionVisibilityForGroupAvatar;
  action: ActionChattingType;
}

export class ContextMenuAvatarModel implements BaseContextMenuModel{
  label: string;
  visibility: ActionVisibilityForChatting;
  action: ActionAvatarType;
}

export class ContextMenuCollectModel {
  label: string;
  visibility: ActionVisibilityForGroupAvatar;
  action: ActionCollectType;
}
