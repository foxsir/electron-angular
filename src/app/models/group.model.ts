import {BaseEntity} from "typeorm";

export class GroupModel extends BaseEntity {
  allowPrivateChat: number; // 开启隐私 0未开启 1开启
  avatar: string; // 群头像
  avatarIncludeCnt: number; //头像拼接人数(无用)
  createTime: string; // 创建时间 "2021-07-19 20:09:55";
  createUserUid: number; // 创建者id
  customerServiceSwitch: number; // 专属客服 0关闭1开启
  delTime: number; // 群被删除时间
  delUserUid: number; // 删除群的操作人
  firbidCause: string; // 封禁原因
  forbidTime: number; //  封禁时间
  forbidUserUid: number; // 封禁操作人
  gNoticeUpdatetime: number; // 群公告更新时间
  gid: string; // 群id "0000000072"
  gmemberCount: number; // 群成员数量
  gmute: number; // 静音 0未静音 1静音
  gname: string; // 群名称
  gnotice: string; // 群公告
  gnoticeUpdatetime: number; // 公告更新时间
  gnoticeUpdateuid: number; // 公告更新用户id
  gownerUserUid: number; // 群主id
  groupCornet: string; // 群通讯号
  gstatus: number; // 群状态 群状态-1 已删除，0 封禁，1 正常
  gtopContent: string; //  群上屏内容
  invite: number; // 是否接收邀请入群 0否1是
  kickNotice: number; //  踢人通知 0关闭 1开启
  leaveNotice: number; // 退群通知 0关闭1开启
  maxMemberCount: number; // 成员上限
  revocationNotice: number; // 退群通知 0关闭1开启
  showMemberNickname: number; // 显示群员昵称
  silenceNotice: number; // 个人禁言通知 0关闭1开启
  tabSwitch: number; // 群页签 0关闭1开启
  talkInterval: number; // 群发言间隔(s)
  talkIntervalSwitch: number; // 群发言间隔开关 0关闭1开启
  topContentSwitch: number; // 群上屏 0关闭1开启
}
