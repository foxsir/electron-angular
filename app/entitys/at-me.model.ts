import {Column, PrimaryGeneratedColumn} from "typeorm";

export default class AtMeModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dataId: string;

  @Column()
  fingerPrintOfProtocal: string = null;

  @Column()
  date: number = 0;
}
