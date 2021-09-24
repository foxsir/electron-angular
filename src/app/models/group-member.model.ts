import {BaseEntity} from "typeorm";

export class GroupMemberModel extends BaseEntity {
  allowPrivateChat: string;
  banTime: number;
  clusterName: string;
  groupId: string;
  groupOwner: string;
  groupOwnerName: string;
  identity: string;
  isAdmin: number = 0;
  showNickname: string;
  status: number;
  stopTalk: number;
  updateAvatarTimestamp: number;
  userAvatarFileName: string;
  userUid: number;
}
