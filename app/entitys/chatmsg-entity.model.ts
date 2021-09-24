import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';


/**

 * 聊天消息体模型

 */
@Entity()
export default class ChatmsgEntityModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // chatting id
  @Column()
  dataId: string;

  //======================================================== 核心数据字段 START

  /** 消息发起者的uid（用于功能链接中使用） */
  @Column({nullable: true})
  uid: string = "";




  /** 昵称（用于显示） */
  @Column({nullable: true})
  name: string = "";


  /** 消息时间戳长整数（形如：1525330876101） */
  @Column({nullable: true})
  date: number = 0;


  /**

   * 消息内容（注意：此消息内容可能并非文本，以不同消息定义的封装对象为准）。

   * 当前除了文件消息外（文件消息放的是{@link FileMeta}对象），其它消息类型存放的都是文本内容。

   * */
  @Column({nullable: true})
  text: string = "";


  /** 消息类型 */
  @Column({nullable: true})
  msgType: number = 0;


  /** 消息所对应的原始协议包指纹，目前只在发出的消息对象中有意义 */
  @Column({nullable: true})
  fingerPrintOfProtocal: string = "";




  /** true表示是发出的消息，否则表示收到的消息 */
  @Column({nullable: true})
  isOutgoing: boolean = true;


  //======================================================== 核心数据字段 END



  //======================================================== 专用于BBS/群聊消息的核心数据字段 START

  ///**

  // * 目前本字段仅用于记录BBS消息发送者的uid.且此uid主要用于获取该用户头像、查看该人员人息等之用.

  // * @since 2.4

  // * */
  @Column({nullable: true})
  //private String uidForBBSCome = null;


  /**

   * 目前本字段仅用于记录BBS消息发送者的头像存放于服务端的文件名.此文件名将用于本地缓存时使用.

   *

   * @since 2.4

   * */
  @Column({nullable: true})
  userAvatarFileNameForBBSCome: string = "";


  //======================================================== 专用于BBS/群聊消息的核心数据字段 START


  @Column({nullable: true})
  xu_isRead_type: boolean = false;


}


