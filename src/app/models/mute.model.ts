import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, PrimaryColumn} from 'typeorm';

export default class MuteModel extends BaseEntity {
  id: number;

  dataId: string;

  mute: boolean = false; // 静音

  updated_at: number = 0; // 修改时间
}


