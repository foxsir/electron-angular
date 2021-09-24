import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class GroupModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  allowPrivateChat: number = 0; // 开启隐私 0未开启 1开启

  @Column({nullable: true})
  avatar: string = ""; // 群头像

  @Column({nullable: true})
  avatarIncludeCnt: number = 0; //头像拼接人数(无用)

  @Column({nullable: true})
  createTime: string = ""; // 创建时间 "2021-07-19 20:09:55";

  @Column({nullable: true})
  createUserUid: number = 0; // 创建者id

  @Column({nullable: true})
  customerServiceSwitch: number = 0; // 专属客服 0关闭1开启

  @Column({nullable: true})
  delTime: number = 0; // 群被删除时间

  @Column({nullable: true})
  delUserUid: number = 0; // 删除群的操作人

  @Column({nullable: true})
  firbidCause: string = ""; // 封禁原因

  @Column({nullable: true})
  forbidTime: number = 0; //  封禁时间

  @Column({nullable: true})
  forbidUserUid: number = 0; // 封禁操作人

  @Column({nullable: true})
  gid: string = ""; // 群id "0000000072"

  @Column({nullable: true})
  gmemberCount: 2; // 群成员数量

  @Column({nullable: true})
  gmute: number = 0; // 静音 0未静音 1静音

  @Column({nullable: true})
  gname: string = ""; // 群名称

  @Column({nullable: true})
  gnotice: string = ""; // 群公告

  @Column({nullable: true})
  gnoticeUpdatetime: number = 0; // 公告更新时间

  @Column({nullable: true})
  gnoticeUpdateuid: number = 0; // 公告更新用户id

  @Column({nullable: true})
  gownerUserUid: number = 0; // 群主id

  @Column({nullable: true})
  groupCornet: string = ""; // 群通讯号

  @Column({nullable: true})
  gstatus: number = 1; // 群状态 群状态-1 已删除，0 封禁，1 正常

  @Column({nullable: true})
  gtopContent: string = ""; //  群上屏内容

  @Column({nullable: true})
  invite: number = 0; // 是否接收邀请入群 0否1是

  @Column({nullable: true})
  kickNotice: number = 0; //  踢人通知 0关闭 1开启

  @Column({nullable: true})
  leaveNotice: number = 0; // 退群通知 0关闭1开启

  @Column({nullable: true})
  maxMemberCount: number = 0; // 成员上限

  @Column({nullable: true})
  revocationNotice: number = 1; // 退群通知 0关闭1开启

  @Column({nullable: true})
  showMemberNickname: number = 0; // 显示群员昵称

  @Column({nullable: true})
  silenceNotice: number = 0; // 个人禁言通知 0关闭1开启

  @Column({nullable: true})
  tabSwitch: number = 0; // 群页签 0关闭1开启

  @Column({nullable: true})
  talkInterval: number = 3; // 群发言间隔(s)

  @Column({nullable: true})
  talkIntervalSwitch: number = 1; // 群发言间隔开关 0关闭1开启

  @Column({nullable: true})
  topContentSwitch: number = 0; // 群上屏 0关闭1开启


}


