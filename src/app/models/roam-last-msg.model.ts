import {ProtocalModel} from "./protocal.model";

export class RoamLastMsgModel {
  chatType: string;
  lastMsg: string; // ProtocalModel
  recvTime: number;
  remark: string;
  avatar: string;
  uid?: string;
  gid?: string;
  unread: number;
}
