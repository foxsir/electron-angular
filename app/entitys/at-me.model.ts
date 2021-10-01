import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export default class AtMeModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dataId: string;

  @Column()
  fingerPrintOfProtocal: string = null;

  @Column()
  date: number = 0;
}
