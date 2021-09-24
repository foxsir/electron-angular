import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class RoamLastMsgModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  chatType: string = "";

  @Column({nullable: true})
  lastMsg: string = ""; // ProtocalModel

  @Column({nullable: true})
  recvTime: number = 0;

  @Column({nullable: true})
  avatar: string = "";

  @Column({nullable: true})
  uid?: string = "";

  @Column({nullable: true})
  gid?: string = "";

  @Column({nullable: true})
  unread: number = 0;


}


