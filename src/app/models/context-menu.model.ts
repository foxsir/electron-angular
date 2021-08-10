import ChatmsgEntityModel from "./chatmsg-entity.model";


type ActionType = (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => void;

export default class ContextMenuModel {
  label: string;
  limits: string[];
  action: ActionType;
}
