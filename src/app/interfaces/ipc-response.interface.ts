import {BaseEntity} from "typeorm";

export default interface IpcResponseInterface<T> {
  status: number;
  uuid: string;
  data: T[];
}
