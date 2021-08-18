import { Injectable } from '@angular/core';
import {ProtocalModel} from "@app/models/protocal.model";
import {Subject} from "rxjs";
import {UserProtocalsType} from "@app/config/rbchat-config";

@Injectable({
  providedIn: 'root'
})
export class MessageDistributeService {

  private MT01_OF_ONLINE_NOTIVICATIONSource = new Subject();
  public MT01_OF_ONLINE_NOTIVICATION$ = this.MT01_OF_ONLINE_NOTIVICATIONSource.asObservable();

  private MT02_OF_OFFLINE_NOTIVICATIONSource = new Subject();
  public MT02_OF_OFFLINE_NOTIVICATION$ = this.MT02_OF_OFFLINE_NOTIVICATIONSource.asObservable();

  private MT43_OF_TEMP$CHAT$MSG_SERVER$TO$BSource = new Subject();
  public MT43_OF_TEMP$CHAT$MSG_SERVER$TO$B$ = this.MT43_OF_TEMP$CHAT$MSG_SERVER$TO$BSource.asObservable();

  private MT45_OF_GROUP$CHAT$MSG_SERVER$TO$BSource = new Subject();
  public MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B$ = this.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$BSource.asObservable();

  private MT44_OF_GROUP$CHAT$MSG_A$TO$SERVERSource = new Subject();
  public MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER$ = this.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVERSource.asObservable();

  private MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVERSource = new Subject();
  public MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVER$ = this.MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVERSource.asObservable();

  private MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVERSource = new Subject();
  public MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVER$ = this.MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVERSource.asObservable();

  private MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVERSource = new Subject();
  public MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVER$ = this.MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVERSource.asObservable();

  private MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVERSource = new Subject();
  public MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVER$ = this.MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVERSource.asObservable();

  private MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVERSource = new Subject();
  public MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVER$ = this.MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVERSource.asObservable();

  private MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVERSource = new Subject();
  public MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVER$ =
    this.MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVERSource.asObservable();

  private MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$ASource = new Subject();
  public MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$A$ =
    this.MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$ASource.asObservable();

  private MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$BSource = new Subject<ProtocalModel>();
  public MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$B$ = this.MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$BSource.asObservable();

  private MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENTSource = new Subject<ProtocalModel>();
  public MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENT$ =
    this.MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENTSource.asObservable();

  private MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULTSource = new Subject<ProtocalModel>();
  public MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULT$ =
    this.MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULTSource.asObservable();

  private MT03_OF_CHATTING_MESSAGESource = new Subject<ProtocalModel>();
  public MT03_OF_CHATTING_MESSAGE$ = this.MT03_OF_CHATTING_MESSAGESource.asObservable();

  private MT16_OF_VIDEO$VOICE_SWITCH$TO$VOICE$AND$VIDEOSource = new Subject<ProtocalModel>();
  public MT16_OF_VIDEO$VOICE_SWITCH$TO$VOICE$AND$VIDEO$ =
    this.MT16_OF_VIDEO$VOICE_SWITCH$TO$VOICE$AND$VIDEOSource.asObservable();

  private MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$ASource = new Subject<ProtocalModel>();
  public MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$A$ = this.MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$ASource.asObservable();

  private MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$ASource = new Subject<ProtocalModel>();
  public MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$A$ = this.MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$ASource.asObservable();

  private MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$ASource = new Subject<ProtocalModel>();
  public MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$A$ = this.MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$ASource.asObservable();

  private illegalMessageSource = new Subject<ProtocalModel>();
  public illegalMessage$ = this.MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$ASource.asObservable();


  constructor() { }

  inceptMessage(originData: ProtocalModel) {
    const typeu = originData.typeu;

    switch (typeu) {
      case UserProtocalsType.MT01_OF_ONLINE_NOTIVICATION:
        this.MT01_OF_ONLINE_NOTIVICATION(originData);
        break;
      case UserProtocalsType.MT02_OF_OFFLINE_NOTIVICATION:
        this.MT02_OF_OFFLINE_NOTIVICATION(originData);
        break;
      case UserProtocalsType.MT43_OF_TEMP$CHAT$MSG_SERVER$TO$B:
        this.MT43_OF_TEMP$CHAT$MSG_SERVER$TO$B(originData);
        break;
      case UserProtocalsType.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B:
        this.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B(originData);
        break;
      case UserProtocalsType.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER:
        this.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER(originData);
        break;
      case UserProtocalsType.MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVER:
        this.MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVER(originData);
        break;
      case UserProtocalsType.MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVER:
        this.MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVER(originData);
        break;
      case UserProtocalsType.MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVER:
        this.MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVER(originData);
        break;
      case UserProtocalsType.MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVER:
        this.MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVER(originData);
        break;
      case UserProtocalsType.MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVER:
        this.MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVER(originData);
        break;
      case UserProtocalsType.MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVER:
        this.MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVER(originData);
        break;
      case UserProtocalsType.MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$A:
        this.MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$A(originData);
        break;
      case UserProtocalsType.MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$B:
        this.MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$B(originData);
        break;
      case UserProtocalsType.MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENT:
        this.MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENT(originData);
        break;
      case UserProtocalsType.MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULT:
        this.MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULT(originData);
        break;
      case UserProtocalsType.MT03_OF_CHATTING_MESSAGE:
        this.MT03_OF_CHATTING_MESSAGE(originData);
        break;
      case UserProtocalsType.MT16_OF_VIDEO$VOICE_SWITCH$TO$VOICE$AND$VIDEO:
        this.MT16_OF_VIDEO$VOICE_SWITCH$TO$VOICE$AND$VIDEO(originData);
        break;
      case UserProtocalsType.MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$A:
        this.MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$A(originData);
        break;
      case UserProtocalsType.MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$A:
        this.MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$A(originData);
        break;
      case UserProtocalsType.MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$A:
        this.MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$A(originData);
        break;
      default:
        this.illegalMessage(originData);
    }

  }

  /**
   * 服务端发来的上线通知
   * @param originData
   * @constructor
   * @private
   */
  private MT01_OF_ONLINE_NOTIVICATION(originData: ProtocalModel) {
    this.MT01_OF_ONLINE_NOTIVICATIONSource.next(originData);

  }

  /**
   * 【IM指令：好友下线通知】
   * @param originData
   * @constructor
   * @private
   */
  private MT02_OF_OFFLINE_NOTIVICATION(originData: ProtocalModel) {
    this.MT02_OF_OFFLINE_NOTIVICATIONSource.next(originData);
  }

  /**
   * 【IM指令：临时/陌生人聊天消息->由服务端转发给接收人B的【步骤2/2】
   * 来自发送方的临时聊天消息
   * @param originData
   * @constructor
   * @private
   */
  private MT43_OF_TEMP$CHAT$MSG_SERVER$TO$B(originData: ProtocalModel) {
    this.MT43_OF_TEMP$CHAT$MSG_SERVER$TO$BSource.next(originData);
  }

  /**
   * 【IM指令：群聊/世界频道聊天消息->由服务端转发给接收人B的【步骤2/2】
   * @param originData
   * @constructor
   * @private
   */
  private MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B(originData: ProtocalModel) {
    this.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$BSource.next(originData);

  }

  /**
   * 新增 --- 这是新增的多端发送时发给自己的 本来是没有的
   * @param originData
   * @constructor
   * @private
   */
  private MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER(originData: ProtocalModel) {
    this.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVERSource.next(originData);
  }

  /**
   * 【IM指令：群聊系统指令->加群成功后通知被加群者（由Server发出）】：通知接收人可能是在创建群或群建好后邀请进入的
   * @param originData
   * @constructor
   * @private
   */
  private MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVER(originData: ProtocalModel) {
    this.MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVERSource.next(originData);
  }

  /**
   * 【IM指令：群聊系统指令->通用的系统信息给指定群员（由Server发出，指定群员接收）】
   * @param originData
   * @constructor
   * @private
   */
  private MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVER(originData: ProtocalModel) {
    this.MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVERSource.next(originData);
  }

  /**
   * 【IM指令：群聊系统指令->群已被解散（由Server发出，除解散者外的所有人接收）】
   * @param originData
   * @constructor
   * @private
   */
  private MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVER(originData: ProtocalModel) {
    this.MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVERSource.next(originData);
  }

  /**
   * 【IM指令：群聊系统指令->"你"被踢出群聊（由Server发出，被踢者接收） 】
   * @param originData
   * @constructor
   * @private
   */
  private MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVER(originData: ProtocalModel) {
    this.MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVERSource.next(originData);
  }

  /**
   * 【IM指令：群聊系统指令->"别人"主动退出或被群主踢出群聊（由Server发出，其它群员接收）】
   * @param originData
   * @constructor
   * @private
   */
  private MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVER(originData: ProtocalModel) {
    this.MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVERSource.next(originData);
  }

  /**
   * 【IM指令：群聊系统指令->群名被修改的系统通知（由Server发出，所有除修改者外的群员接收） 】
   * @param originData
   * @constructor
   * @private
   */
  private MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVER(originData: ProtocalModel) {
    this.MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVERSource.next(originData);
  }

  /**
   * 【IM指令：加好友错误提示】
   * 由服务端反馈给加好友发起人的错误信息(出错的可能是：该好友已
   * 经存在于我的好友列表中、插入好友请求到db中时出错等)
   * @param originData
   * @constructor
   * @private
   */
  private MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$A(originData: ProtocalModel) {
    this.MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$ASource.next(originData);
  }

  /**
   * 【IM指令：收到了加好友请求->服务端通知在线被加好友者】
   * @param originData
   * @constructor
   * @private
   */
  private MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$B(originData: ProtocalModel) {
    this.MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$BSource.next(originData);
    // 解析后便是RosterElementEntity对象，
  }

  /**
   * 【IM指令：好友关系建立成功通知】
   * 新好友已成功被添加后由服务端发给在线用户对方的个人信息（此场景是被请求用户
   * 同意了加好友的请求时，由服务端把双方的好友信息及时交给对方（如果双方有人在线的话））
   * ，加入到本地好友列表中了后，就可以及时聊天了（如果对方此时在线的话）
   * @param originData
   * @constructor
   * @private
   */
  private MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENT(originData: ProtocalModel) {
    this.MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENTSource.next(originData);
    // RosterElementEntity对象，
  }

  /**
   * 【IM指令：加好友被拒绝的实时通知->(由服务端在B拒绝A的请求后实时通知A)】
   * @param originData
   * @constructor
   * @private
   */
  private MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULT(originData: ProtocalModel) {
    this.MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULTSource.next(originData);
    // RosterElementEntity对象，
    // 详见：http://docs.52im.net/extend/docs/api/rainbowchatserver4_pro/com/x52im/rainbowchat/http/logic/dto/RosterElementEntity.html

  }

  /**
   * 【IM指令：普通一对一聊天消息->（聊天消息可能是：文本、图片、语音留言、礼物等）】
   * @param originData
   * @constructor
   * @private
   */
  private MT03_OF_CHATTING_MESSAGE(originData: ProtocalModel) {
    this.MT03_OF_CHATTING_MESSAGESource.next(originData);
  }

  /**
   * 下面是聊天音视频类型
   * @param originData
   * @constructor
   * @private
   */
  private MT16_OF_VIDEO$VOICE_SWITCH$TO$VOICE$AND$VIDEO(originData: ProtocalModel) {
    this.MT16_OF_VIDEO$VOICE_SWITCH$TO$VOICE$AND$VIDEOSource.next(originData);

  }

  /**
   * 视频聊天呼叫中：请求视频聊天(发起方A)
   * @param originData
   * @constructor
   * @private
   */
  private MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$A(originData: ProtocalModel) {
    this.MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$ASource.next(originData);

  }

  /**
   * 如果没有开启窗口则不进行任何操作，：应在别的客户端操作了
   * @param originData
   * @constructor
   * @private
   */
  private MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$A(originData: ProtocalModel) {
    this.MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$ASource.next(originData);

  }

  /**
   * 视频聊天呼叫中：同意视频聊天请求(接收方B) 1111改为占线
   * @param originData
   * @constructor
   * @private
   */
  private MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$A(originData: ProtocalModel) {
    this.MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$ASource.next(originData);

  }

  /**
   * 数据包，无法继续处理，请核实协议定义
   * @param originData
   * @private
   */
  private illegalMessage(originData: ProtocalModel) {
    this.illegalMessageSource.next(originData);
    // log("【onIMData】【非法】来自" + userid + "的未定义typeu=" + typeu + "数据包，无法继续处理，请核实协议定义！", true);
  }

}
