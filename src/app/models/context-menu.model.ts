import ChatmsgEntityModel from "./chatmsg-entity.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";


type ActionType = (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => void;

type ActionChattingType = (chatting: AlarmItemInterface, chattingList: AlarmItemInterface[]) => void;

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
