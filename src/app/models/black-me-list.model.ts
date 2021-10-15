import {BaseEntity} from "typeorm";

export default class BlackMeListModel extends BaseEntity {
  balance: string;
  googleSecret: string;
  latestLoginAddres: string;
  latestLoginIp: string;
  maxFriend: string;
  myCommunicationNumber: string;
  nickname: string;
  online: string;
  reCommunicationNumber: string;
  registerAddres: string;
  registerIp: string;
  token: string;
  userAvatarFileName: string;
  userCornet: string;
  userCornetChanged: string;
  userLevel: string;
  userMail: string;
  userPhone: string;
  userSex: string;
  userType: number;
  userUid: number;
  whatSUp: string;
}
