import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, PrimaryColumn} from 'typeorm';

@Entity()
export default class UserModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  userUid: number = 0; //用户id

  @Column({nullable: true})
  userMail: string = ""; //账号

  @Column({nullable: true})
  nickname: string = ""; //昵称

  @Column({nullable: true})
  userAvatarFileName: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAIAAAABc2X6AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAhJJREFUeNrs2l+LgkAUBfAapLKs6Ckk+v4fzAeJiMimrJDYQy0S+yCT3mtOe+ahJ8X9NX8897b9zF56/2n0CSaYYIIJJphgggkmmGCCCSaYYIIJbj4ul98nGmMGg8HXgq21x+Ox1Jbm0Wg0n8/x+T3g2+222WyKoqi4BuDlcgm/92BM7Ha7dbkS2jiOtRe5Lvh8PmNu3a+HebVaBUHgJfh+vydJgs+37sLaxjzrgRX3zG63e1f7PMOxC/wDg4r1XO/e0+nkHxgTVWN6y53vHxivIpFw4tMe7uYgmOB6o2E21ovWiuDawXg8Hnu5pFEDtXzjh8Gz2axGKsb0qpaKusUD3sZpmronEJRKCNKqRaJ6eehubkHbUgMApT9K4urwhPW/WCy+oQHwmhafLZ7X1gdmdTKZRFGkWgN/BtyRQTDBDY9oFLfX69XllMY2Hg6HeA972dOy1u73++rWbEUsxYmtFD/kwS5daEe2RqdaGOzehXbKvQqdakmwrFbJLAZGokCEVKlvjFmv11JrWwZcr+f+VgmF/dyh8jDLMj1t79G4lepjyoAPh4N2YJB6hBH5+lWnV/YpAuA8z1urtzoBbvgjQ8sPYl+aYIL/jul02sYfaoxIg14maaE2wnsSh4r4z5yojRGkwzCMokgkXarUw8VjNJxPpX/nYYuHYIIJJphgggkmmGCCCSaYYIIJJtj78SPAAHIQlXSfrkB+AAAAAElFTkSuQmCC"; //头像

  @Column({nullable: true})
  userType: number = 0; //用户类型 0普通用户， 1普通管理员，2超级管理员  3客服

  @Column({nullable: true})
  userPhone: string = ""; //手机号

  @Column({nullable: true})
  balance: number = 0; //余额

  @Column({nullable: true})
  level: string = ""; //

  @Column({nullable: true})
  levelName: string = ""; //

  @Column({nullable: true})
  addGroup: string = ""; //

  @Column({nullable: true})
  sendRedpacket: string = ""; //

  @Column({nullable: true})
  addFriend: string = ""; //

  @Column({nullable: true})
  createGroup: string = ""; //

  @Column({nullable: true})
  addFriendSuper: string = ""; //

  @Column({nullable: true})
  addGroupSuper: string = ""; //

  @Column({nullable: true})
  addPersonSuper: string = ""; //

  @Column({nullable: true})
  groupDelMsg: string = ""; //

  @Column({nullable: true})
  seeYunMsg: string = ""; //

  @Column({nullable: true})
  msgTab: string = ""; //

  @Column({nullable: true})
  friendTab: string = ""; //

  @Column({nullable: true})
  circleTab: string = ""; //

  @Column({nullable: true})
  walletTab: string = ""; //

  @Column({nullable: true})
  collectionTab: string = ""; //

  @Column({nullable: true})
  findTab: string = ""; //

  @Column({nullable: true})
  reCommunicationNumber: string = ""; //注册时的邀请码

  @Column({nullable: true})
  myCommunicationNumber: string = ""; //邀请码

  @Column({nullable: true})
  userCornet: string = ""; //通讯号

  @Column({nullable: true})
  googleSecret: string = ""; //谷歌验证器

  @Column({nullable: true})
  latestLoginAddres: string = ""; //上次登录地址

  @Column({nullable: true})
  registerAddres: string = ""; //注册地址

  @Column({nullable: true})
  latestLoginIp: string = ""; //上次登录ip

  @Column({nullable: true})
  registerIp: string = ""; //注册ip

  @Column({nullable: true})
  online: string = ""; //在线状态

  @Column({nullable: true})
  token: string = ""; //token

  @Column({nullable: true})
  whatSUp: string = ""; //个性签名

  @Column({nullable: true})
  maxFriend: number = 0; //最大好友数

  @Column({nullable: true})
  userSex: number = 0; //用户性别1男0女

  @Column({nullable: true})
  userCornetChanged: string = ""; // 通讯号是否被修改过

  @Column({nullable: true})
  userLevel: string;
}


