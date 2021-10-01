/**
 * 聊天消息体模型
 */
import {BaseEntity} from "typeorm";

export default class ChatmsgEntityModel extends BaseEntity {
  //======================================================== 核心数据字段 START
  // chatting id
  dataId: string;
  /** 消息发起者的uid（用于功能链接中使用） */
  uid: string = null;

  /** 昵称（用于显示） */
  name: string = null;
  /** 消息时间戳长整数（形如：1525330876101） */
  date: number = 0;
  /**
   * 消息内容（注意：此消息内容可能并非文本，以不同消息定义的封装对象为准）。
   * 当前除了文件消息外（文件消息放的是{@link FileMeta}对象），其它消息类型存放的都是文本内容。
   * */
  text: string = null;
  /** 消息类型 */
  msgType: number = 0;
  /** 消息所对应的原始协议包指纹，目前只在发出的消息对象中有意义 */
  fingerPrintOfProtocal: string = null;

  /** true表示是发出的消息，否则表示收到的消息 */
  isOutgoing: boolean = true;
  //======================================================== 核心数据字段 END

  //======================================================== 专用于BBS/群聊消息的核心数据字段 START
  ///**
  // * 目前本字段仅用于记录BBS消息发送者的uid.且此uid主要用于获取该用户头像、查看该人员人息等之用.
  // * @since 2.4
  // * */
  //private String uidForBBSCome = null;
  /**
   * 目前本字段仅用于记录BBS消息发送者的头像存放于服务端的文件名.此文件名将用于本地缓存时使用.
   *
   * @since 2.4
   * */
  userAvatarFileNameForBBSCome: string = null;
  //======================================================== 专用于BBS/群聊消息的核心数据字段 START

  xu_isRead_type: boolean = false;

  // 用户头像
  uh: string = "";
}
