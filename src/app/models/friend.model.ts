import {BaseEntity} from "typeorm";

export default class FriendModel extends BaseEntity {
  friendUserUid: number;
  /**
   * @deprecated
   */
  isOnline: number; // 是否在线 0否 1是(已废弃)
  base64Avatar: string;
  userUid:  number; //  用户id
  nickname:  string; //  好友昵称
  remark:  string; //  对好友的备注
  userAvatarFileName:  string; //  好友头像
  userCornet:  string; //  好友通讯号
  groupName:  string; //  好友分组
  userSex:  string; //  好友性别
  whatSUp:  string; //  好友签名
  latestLoginTime:  number; //  最近登录时间(时间戳)
  onlineStatus:  boolean; //  好友在线状态
  updateAvatarTimestamp:  number; //  头像更新时间戳
  registerTime: string; //注册时间
}
