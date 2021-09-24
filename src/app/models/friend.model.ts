import {BaseEntity} from "typeorm";

export default class FriendModel extends BaseEntity {
  friendUserUid: number;
  isOnline: number; // 0 or 1
  nickname: string;
  userAvatarFileName: string;
  base64Avatar: string;
  userUid: string;
  onlineStatus: boolean;
}
