import {ProtocalModel} from "./protocal.model";

export class RoamLastMsgModel {
  chatType: string;
  lastMsg: string; // ProtocalModel
  recvTime: number;
  avatar: string;
  uid?: string;
  gid?: string;
  unread: number;
}
