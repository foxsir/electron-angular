import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export default class SessionStatusModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  friendId: string = "";

  @Column({nullable: true})
  noDisturb: boolean = false;

  @Column({nullable: true})
  top: boolean = false;

  @Column({nullable: true})
  userId: number = 0;

  @Column({nullable: true})
  userType: number = 0; // 0好友 1群组


}


