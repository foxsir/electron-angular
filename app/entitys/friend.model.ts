import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export default class FriendModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  friendUserUid: number = 0;

  @Column({nullable: true})
  isOnline: number = 0; // 0 or 1

  @Column({nullable: true})
  nickname: string = "";

  @Column({nullable: true})
  userAvatarFileName: string = "";

  @Column({nullable: true})
  base64Avatar: string = "";

  @Column({nullable: true})
  userUid: string = "";

  @Column({nullable: true})
  onlineStatus: boolean = false;


}


