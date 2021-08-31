export default class MergeTransferModel {
  content: string;
  messages: {
    date: number;
    sendId: string;
    sendNicName: string;
    text: string;
    type: string; // 消息类型
  }[]
}
