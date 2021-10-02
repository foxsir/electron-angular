import {BaseEntity} from "typeorm";

export default class AtMeModel extends BaseEntity{
  dataId: string;
  fingerPrintOfProtocal: string = null;
  date: number = 0;
}
