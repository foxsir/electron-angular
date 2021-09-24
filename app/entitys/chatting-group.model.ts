import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export default class ChattingGroupModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  create_time: string = "";

  @Column({nullable: true})
  create_user_name: string = "";

  @Column({nullable: true})
  g_id: string = "";

  @Column({nullable: true})
  g_member_count: string = "";

  @Column({nullable: true})
  g_name: string = "";

  @Column({nullable: true})
  g_notice: string = "";

  @Column({nullable: true})
  g_notice_updatenick: string = "";

  @Column({nullable: true})
  g_notice_updatetime: string = "";

  @Column({nullable: true})
  g_notice_updateuid: string = "";

  @Column({nullable: true})
  g_owner_name: string = "";

  @Column({nullable: true})
  g_owner_user_uid: string = "";

  @Column({nullable: true})
  g_status: string = "";

  @Column({nullable: true})
  imIsInGroup: string = "";

  @Column({nullable: true})
  max_member_count: string = "";

  @Column({nullable: true})
  nickname_ingroup: string = "";

  @Column({nullable: true})
  worldChat: boolean = false;


}


