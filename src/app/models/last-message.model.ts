import {BaseEntity} from "typeorm";

export default class LastMessageModel extends BaseEntity {
  dataId: string;
  fp: string;
}
