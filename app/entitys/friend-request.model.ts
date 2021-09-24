import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class FriendRequestModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  reqDesc: string = "";

  @Column({nullable: true})
  reqTime: string = "";

  @Column({nullable: true})
  reqUserAvatar: string = "";

  @Column({nullable: true})
  reqUserId: number = 0;

  @Column({nullable: true})
  reqUserNickname:  string = "";

  @Column({nullable: true})
  userId: number = 0;

  @Column({nullable: true})
  agree: boolean; // 仅在本地有效


}


