import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export default class BlackMeListModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  balance: string = "";

  @Column({nullable: true})
  googleSecret: string = "";

  @Column({nullable: true})
  latestLoginAddres: string = "";

  @Column({nullable: true})
  latestLoginIp: string = "";

  @Column({nullable: true})
  maxFriend: string = "";

  @Column({nullable: true})
  myCommunicationNumber: string = "";

  @Column({nullable: true})
  nickname: string = "";

  @Column({nullable: true})
  online: string = "";

  @Column({nullable: true})
  reCommunicationNumber: string = "";

  @Column({nullable: true})
  registerAddres: string = "";

  @Column({nullable: true})
  registerIp: string = "";

  @Column({nullable: true})
  token: string = "";

  @Column({nullable: true})
  userAvatarFileName: string = "";

  @Column({nullable: true})
  userCornet: string = "";

  @Column({nullable: true})
  userCornetChanged: string = "";

  @Column({nullable: true})
  userLevel: string = "";

  @Column({nullable: true})
  userMail: string = "";

  @Column({nullable: true})
  userPhone: string = "";

  @Column({nullable: true})
  userSex: string = "";

  @Column({nullable: true})
  userType: number = 0;

  @Column({nullable: true})
  userUid: number = 0;

  @Column({nullable: true})
  whatSUp: string = "";


}


