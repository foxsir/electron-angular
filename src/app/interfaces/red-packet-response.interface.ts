export interface RedPacketResponseInterface {
  coverUrl: string;
  greetings: string;
  orderId: string;
  type: number;
  userId: number;
  userIds: string;
  word: string;
  status: string; // 1 发出 2已领完 -1已退款  3未领完退款
  expireTime: number;
}
