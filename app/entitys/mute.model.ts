import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, PrimaryColumn} from 'typeorm';

@Entity()
export default class MuteModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dataId: string;

  @Column()
  mute: boolean = false; // 静音

  @Column()
  updated_at: number = 0; // 修改时间
}


