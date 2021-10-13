import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export default class LastMessageModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  dataId: string;

  @Column({nullable: true})
  fp: string;
}
