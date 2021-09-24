import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, PrimaryColumn} from 'typeorm';

@Entity()
export default class CollectModel extends BaseEntity {
  @PrimaryColumn()
  id: number = 0;

  @Column({nullable: true})
  content: string = "";

  @Column({nullable: true})
  createTime: string = "";

  @Column({nullable: true})
  fromUserId: number = 0;

  @Column({nullable: true})
  nickname: string = "";

  @Column({nullable: true})
  type: number = 0;

  @Column({nullable: true})
  userId: number = 0;


}


