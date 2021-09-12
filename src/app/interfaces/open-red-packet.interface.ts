export interface MyRedPacketInterface {
  count: number;
  coverUrl: string;
  greetings: string;
  groupGid: string;
  id: number;
  money: number;
  orderId: string;
  outTime: string;
  over: number;
  receiveCount: number;
  sendTime: string;
  status: number; // 领取状态 0：未领取  1：已领取 2：本人未领取且红包已领完
  toUserId: number;
  type: number;
  userId: number;
  userIds: string; // id,id
  word: string;
}

export interface FriendRedPacketInterface {
  avatarUrl: string;
  greetings: string;
  meRobMoney: number;
  nickName: string;
  redPackVoList: {
    createTime: string;
    robAvatarUrl: string;
    robMoney: number;
    robNickName: string;
    robUserId: number;
  }[];
  robNum: number;
  robToMoney: number;
  status: number; // 领取状态 0：未领取  1：已领取 2：本人未领取且红包已领完
  total: number;
  totalMoney: number;
  userId: number;
}
