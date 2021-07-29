import ChatMsgEntity from "./ChatMsgEntity";


type ActionType = (chat: ChatMsgEntity, messageContainer: HTMLDivElement) => void;

export default class ContextMenu {
  label: string;
  limits: string[];
  action: ActionType;
}
