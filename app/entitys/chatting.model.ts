import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';


/**

 * 聊天模型

 */
@Entity()
export default class ChattingModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  alarmMessageType: number = 0; // 0单聊 1临时聊天/陌生人聊天 2群聊

  @Column({nullable: true})
  dataId: string = "";

  @Column({nullable: true})
  date: number = 0;

  @Column({nullable: true})
  isTop?: boolean = false;

  @Column({nullable: true})
  msgContent: string = "";

  @Column({nullable: true})
  title: string = "";

  @Column({nullable: true})
  avatar: string = "";

  /*仅本地*/
  @Column()
  chatType: string = 'friend'; // "friend" | "group"

  @Column()
  unread: number = 0; // 未读消息数

  @Column()
  sound: boolean = true; // 声音通知
  /*仅本地*/
}


