import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, PrimaryColumn} from 'typeorm';

export default class TopModel extends BaseEntity {
  id: number;

  dataId: string;

  top: boolean = false; // 顶置

  updated_at: number = 0; // 修改时间
}
