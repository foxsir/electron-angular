import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export default class FriendModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  friendUserUid: number;
  /**
   * @deprecated
   */
  @Column({nullable: true})


  @Column({nullable: true})
  isOnline: number = 0; // 是否在线 0否 1是(已废弃)

  @Column({nullable: true})
  userUid:  number = 0; //  用户id

  @Column({nullable: true})
  nickname:  string; //  好友昵称

  @Column({nullable: true})
  friendAccount:  string; //  好友账号

  @Column({nullable: true})
  remark:  string; //  对好友的备注

  @Column({nullable: true})
  userAvatarFileName:  string; //  好友头像

  @Column({nullable: true})
  userCornet:  string; //  好友通讯号

  @Column({nullable: true})
  groupName:  string; //  好友分组

  @Column({nullable: true})
  userSex:  string; //  好友性别

  @Column({nullable: true})
  whatSUp:  string; //  好友签名

  @Column({nullable: true})
  latestLoginIp:  string; //  上次登录Ip

  @Column({nullable: true})
  registerTime:  string; //  注册时间

  @Column({nullable: true})
  latestLoginTime:  number; //  最近登录时间(时间戳)

  @Column({nullable: true})
  onlineStatus:  boolean; //  好友在线状态

  @Column({nullable: true})
  updateAvatarTimestamp:  number; //  头像更新时间戳


}


