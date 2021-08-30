export class UserModel {
  userUid: number; //用户id
  userMail: string; //账号
    nickname: string; //昵称
    userAvatarFileName: string; //头像
  userType: number; //用户类型 0普通用户， 1普通管理员，2超级管理员  3客服
  userPhone: null; //手机号
  balance: number; //余额
  //用户等级
  userLevel: {
    id:number; //
    level:string; //
    levelName:string; //
    addGroup:string; //
    sendRedpacket:string; //
    addFriend:string; //
    createGroup:string; //
    addFriendSuper:string; //
    addGroupSuper:string; //
    addPersonSuper:string; //
    groupDelMsg:string; //
    seeYunMsg:string; //
    msgTab:string; //
    friendTab:string; //
    circleTab:string; //
    walletTab:string; //
    collectionTab:string; //
    findTab:string; //
  };
  id: number; //
  level: string; //
  levelName: string; //
  addGroup: string; //
  sendRedpacket: string; //
  addFriend: string; //
  createGroup: string; //
  addFriendSuper: string; //
  addGroupSuper: string; //
  addPersonSuper: string; //
  groupDelMsg: string; //
  seeYunMsg: string; //
  msgTab: string; //
  friendTab: string; //
  circleTab: string; //
  walletTab: string; //
  collectionTab: string; //
  findTab: string; //
  reCommunicationNumber: string; //注册时的邀请码
  myCommunicationNumber: string; //邀请码
  userCornet: string; //通讯号
  googleSecret: string; //谷歌验证器
  latestLoginAddres: null; //上次登录地址
  registerAddres: null; //注册地址
  latestLoginIp: null; //上次登录ip
  registerIp: string; //注册ip
  online: null; //在线状态
  token: null; //token
  whatSUp: null; //个性签名
  maxFriend: number; //最大好友数
  userSex: number; //用户性别1男0女
  userCornetChanged: string; //通讯号是否被修改过
}
