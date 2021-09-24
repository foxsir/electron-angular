import {BaseEntity} from "typeorm";

export class FriendRequestModel extends BaseEntity {
  reqDesc: string;
  reqTime: string;
  reqUserAvatar: string;
  reqUserId: number;
  reqUserNickname:  string;
  userId: number;
  agree: boolean = null; // 仅在本地有效
}
