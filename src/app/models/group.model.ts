import {BaseEntity} from "typeorm";

export class GroupModel extends BaseEntity {
  allowPrivateChat: number; // 开启隐私 0未开启 1开启
  avatar: string; // 群头像
  avatarIncludeCnt: number; //头像拼接人数(无用)
  createTime: string; // 创建时间 "2021-07-19 20:09:55";
  createUserUid: number; // 创建者id
  customerServiceSwitch: number; // 专属客服 0关闭1开启
  delTime: null; // 群被删除时间
  delUserUid: null; // 删除群的操作人
  firbidCause: null; // 封禁原因
  forbidTime: null; //  封禁时间
  forbidUserUid: null; // 封禁操作人
  gNoticeUpdatetime: null; // 群公告更新时间
  gid: string; // 群id "0000000072"
  gmemberCount: 2; // 群成员数量
  gmute: number; // 静音 0未静音 1静音
  gname: string; // 群名称
  gnotice: null; // 群公告
  gnoticeUpdatetime: null; // 公告更新时间
  gnoticeUpdateuid: null; // 公告更新用户id
  gownerUserUid: number; // 群主id
  groupCornet: string; // 群通讯号
  gstatus: 1; // 群状态 群状态-1 已删除，0 封禁，1 正常
  gtopContent: null; //  群上屏内容
  invite: 0; // 是否接收邀请入群 0否1是
  kickNotice: null; //  踢人通知 0关闭 1开启
  leaveNotice: null; // 退群通知 0关闭1开启
  maxMemberCount: number; // 成员上限
  revocationNotice: null; // 退群通知 0关闭1开启
  showMemberNickname: 0; // 显示群员昵称
  silenceNotice: null; // 个人禁言通知 0关闭1开启
  tabSwitch: 0; // 群页签 0关闭1开启
  talkInterval: 3; // 群发言间隔(s)
  talkIntervalSwitch: 1; // 群发言间隔开关 0关闭1开启
  topContentSwitch: 0; // 群上屏 0关闭1开启
}
