import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class GroupAdminModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  gid: string; // 群id

  @Column({nullable: true})
  userUid: number = 0; // 非必须 管理员id

  @Column({nullable: true})
  userMail:	string = ""; // 非必须 管理员账户

  @Column({nullable: true})
  nickname:	string = ""; // 非必须 管理员昵称

  @Column({nullable: true})
  userAvatarFileName:	string = ""; // 非必须 头像

  @Column({nullable: true})
  userType:	number = 0; // 非必须 用户类型

  @Column({nullable: true})
  userPhone:	string = ""; // 非必须 手机号

  @Column({nullable: true})
  balance:	string = ""; // 非必须

  @Column({nullable: true})
  userLevel:	string = ""; // 非必须

  @Column({nullable: true})
  reCommunicationNumber: number = 0; // 非必须

  @Column({nullable: true})
  myCommunicationNumber: number = 0; // 非必须

  @Column({nullable: true})
  userCornet:	 number = 0; // 非必须

  @Column({nullable: true})
  googleSecret:	string = ""; // 非必须

  @Column({nullable: true})
  latestLoginAddres: string = ""; // 非必须

  @Column({nullable: true})
  registerAddres: string = ""; // 非必须

  @Column({nullable: true})
  latestLoginIp: string = ""; // 非必须

  @Column({nullable: true})
  registerIp: string = ""; // 非必须

  @Column({nullable: true})
  online:	number = 0; // 非必须

  @Column({nullable: true})
  token: string = ""; // 非必须

  @Column({nullable: true})
  whatSUp: string = ""; // 非必须

  @Column({nullable: true})
  maxFriend: number = 0; // 非必须

  @Column({nullable: true})
  userSex: number = 0; // 非必须


}


