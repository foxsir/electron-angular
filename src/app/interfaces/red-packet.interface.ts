import {RedPacketResponseInterface} from "@app/interfaces/red-packet-response.interface";

export interface RedPacketInterface {
  count: number;
  greetings: string;
  money: number;
  toUserId: string;
  word: string;
  type: number;
  payKey: string;
  ok: boolean;
  res: RedPacketResponseInterface;
}
