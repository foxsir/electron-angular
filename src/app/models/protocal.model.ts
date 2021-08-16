/**
 * socket 推送数据协议模型
 */
export default class ProtocalModel {
  QoS: boolean;
  bridge: true;
  dataContent: string; // JSON.stringify
  fp: string;
  from: string;
  recvTime: number;
  sm: number;
  to: string;
  type: number;
  typeu: number;
}
