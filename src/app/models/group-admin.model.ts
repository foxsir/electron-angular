import {BaseEntity} from "typeorm";

export class GroupAdminModel extends BaseEntity {
  gid: string; // 仅仅本地存在
  userUid: number; // 非必须 管理员id
  userMail:	string; // 非必须 管理员账户
  nickname:	string; // 非必须 管理员昵称
  userAvatarFileName:	string; // 非必须 头像
  userType:	number; // 非必须 用户类型
  userPhone:	string; // 非必须 手机号
  balance:	string; // 非必须
  userLevel:	string; // 非必须
  reCommunicationNumber:	unknown; // 非必须
  myCommunicationNumber:	unknown; // 非必须
  userCornet:	unknown; // 非必须
  googleSecret:	unknown; // 非必须
  latestLoginAddres:	unknown; // 非必须
  registerAddres:	unknown; // 非必须
  latestLoginIp:	unknown; // 非必须
  registerIp:	unknown; // 非必须
  online:	unknown; // 非必须
  token:	unknown; // 非必须
  whatSUp:	unknown; // 非必须
  maxFriend:	unknown; // 非必须
  userSex:	unknown; // 非必须

}
