import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, PrimaryColumn} from 'typeorm';

@Entity()
export default class TopModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dataId: string;

  @Column()
  top: boolean = false; // 顶置

  @Column()
  updated_at: number = 0; // 修改时间
}
