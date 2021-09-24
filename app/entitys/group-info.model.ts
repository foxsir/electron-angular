import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export default class GroupInfoModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  allowPrivateChat: number = 0;

  @Column({nullable: true})
  avatar: string = "";

  @Column({nullable: true})
  avatarIncludeCnt: number = 0;

  @Column({nullable: true})
  createTime: string = "";

  @Column({nullable: true})
  createUserUid: number = 0;

  @Column({nullable: true})
  customerServiceSwitch: number = 0;

  @Column({nullable: true})
  delTime: string = "";

  @Column({nullable: true})
  delUserUid: string = "";

  @Column({nullable: true})
  firbidCause: string = "";

  @Column({nullable: true})
  forbidTime: string = "";

  @Column({nullable: true})
  forbidUserUid: string = "";

  @Column({nullable: true})
  gid: string = "";

  @Column({nullable: true})
  gmemberCount: number = 0;

  @Column({nullable: true})
  gmute: number = 0;

  @Column({nullable: true})
  gname: string = "";

  @Column({nullable: true})
  gnotice: string = "";

  @Column({nullable: true})
  gnoticeUpdatetime: string = "";

  @Column({nullable: true})
  gnoticeUpdateuid: string = "";

  @Column({nullable: true})
  gownerUserUid: number = 0;

  @Column({nullable: true})
  groupCornet: string = "";

  @Column({nullable: true})
  gstatus: number = 0;

  @Column({nullable: true})
  gtopContent: string = "";

  @Column({nullable: true})
  invite: number = 0;

  @Column({nullable: true})
  kickNotice: string = "";

  @Column({nullable: true})
  leaveNotice: string = "";

  @Column({nullable: true})
  maxMemberCount: number = 0;

  @Column({nullable: true})
  revocationNotice: string = "";

  @Column({nullable: true})
  showMemberNickname: number = 0;

  @Column({nullable: true})
  silenceNotice: string = "";

  @Column({nullable: true})
  tabSwitch: number = 0;

  @Column({nullable: true})
  talkInterval: number = 0;

  @Column({nullable: true})
  talkIntervalSwitch: number = 0;

  @Column({nullable: true})
  topContentSwitch: number = 0;


}


