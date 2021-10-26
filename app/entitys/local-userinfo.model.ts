import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export default class LocalUserinfoModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  android_is_online: number = 0;

  @Column({nullable: true})
  ios_liveStatus: number = 0;

  @Column({nullable: true})
  latest_login_ip: string = "";

  @Column({nullable: true})
  latest_login_time: string = "";

  @Column({nullable: true})
  liveStatus: number = 0;

  @Column({nullable: true})
  login: boolean = false;

  @Column({nullable: true})
  maxFriend: number = 0;

  @Column({nullable: true})
  nickname: string = "";

  @Column({nullable: true})
  online: string = "";

  @Column({nullable: true})
  register_time: string = "";

  @Column({nullable: true})
  remark: string = "";

  @Column({nullable: true})
  userAvatarFileName: string = "";

  @Column({nullable: true})
  userDesc: string = "";

  @Column({nullable: true})
  userType: number = 0;

  @Column({nullable: true})
  user_mail: string = "";

  @Column({nullable: true})
  user_phone: string = "";

  @Column({nullable: true})
  user_sex: number = 0;

  @Column({nullable: true})
  // user_uid: string = "";

  @Column({nullable: true})
  userId: number = 0;

  @Column({nullable: true})
  web_liveStatus: number = 0;

  @Column({nullable: true})
  whatSUp: string = "";

  @Column({nullable: true})
  token: string = "";


}


