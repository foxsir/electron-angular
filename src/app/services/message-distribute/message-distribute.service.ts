import { Injectable } from '@angular/core';
import {ProtocalModel} from "@app/models/protocal.model";
import {Subject} from "rxjs";
import {UserProtocalsType} from "@app/config/rbchat-config";

@Injectable({
  providedIn: 'root'
})
export class MessageDistributeService {

  // 好友登录指令 已弃用
  private MT01_OF_ONLINE_NOTIVICATIONSource = new Subject<ProtocalModel>();
  public MT01_OF_ONLINE_NOTIVICATION$ = this.MT01_OF_ONLINE_NOTIVICATIONSource.asObservable();

  // 好友退出指令，已弃用
  private MT02_OF_OFFLINE_NOTIVICATIONSource = new Subject<ProtocalModel>();
  public MT02_OF_OFFLINE_NOTIVICATION$ = this.MT02_OF_OFFLINE_NOTIVICATIONSource.asObservable();

  // 临时聊天消息，已弃用
  private MT43_OF_TEMP$CHAT$MSG_SERVER$TO$BSource = new Subject<ProtocalModel>();
  public MT43_OF_TEMP$CHAT$MSG_SERVER$TO$B$ = this.MT43_OF_TEMP$CHAT$MSG_SERVER$TO$BSource.asObservable();

  // 服务器转发来的群聊消息
  private MT45_OF_GROUP$CHAT$MSG_SERVER$TO$BSource = new Subject<ProtocalModel>();
  public MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B$ = this.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$BSource.asObservable();

  // 发给服务器的群聊消息
  private MT44_OF_GROUP$CHAT$MSG_A$TO$SERVERSource = new Subject<ProtocalModel>();
  public MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER$ = this.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVERSource.asObservable();

  // 群聊系统指令：加群(建群或被邀请时)成功后通知被加群者（由Server发出，所有被加群者接收）
  private MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVERSource = new Subject<ProtocalModel>();
  public MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVER$ = this.MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVERSource.asObservable();

  // 群聊系统指令：通用的系统信息给指定群员（由Server发出，指定群员接收）
  private MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVERSource = new Subject<ProtocalModel>();
  public MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVER$ = this.MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVERSource.asObservable();

  // 群聊系统指令：群已被解散（由Server发出，除解散者外的所有人接收）
  private MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVERSource = new Subject<ProtocalModel>();
  public MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVER$ = this.MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVERSource.asObservable();

  //  群聊系统指令："你"被踢出群聊（由Server发出，被踢者接收）
  private MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVERSource = new Subject<ProtocalModel>();
  public MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVER$ = this.MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVERSource.asObservable();

  //  群聊系统指令："别人"主动退出或被群主踢出群聊（由Server发出，其它群员接收）
  private MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVERSource = new Subject<ProtocalModel>();
  public MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVER$ = this.MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVERSource.asObservable();

  // 群聊系统指令：群名被修改的系统通知（由Server发出，所有除修改者外的群员接收）
  private MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVERSource = new Subject<ProtocalModel>();
  public MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVER$ =
    this.MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVERSource.asObservable();

  // 由服务端反馈给加好友发起人的错误信息头(出错的可能是：该好友已经存在于我的好友列表中、插入好友请求到db中时出错等)
  private MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$ASource = new Subject<ProtocalModel>();
  public MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$A$ =
    this.MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$ASource.asObservable();

  // 由服务端转发的加好友请求消息给在线目标用户
  private MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$BSource = new Subject<ProtocalModel>();
  public MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$B$ = this.MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$BSource.asObservable();

  // 新好友已成功被添加信息头（此场景是被请求用户同意了加好友的请求时，由服务端把双方的好友信息及时交给对方（如果双方有人在线的话））
  private MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENTSource = new Subject<ProtocalModel>();
  public MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENT$ =
    this.MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENTSource.asObservable();

  // 将【拒绝】的加好友结果传回给原请求用户的消息头（由服务端发回给A），此消息发送的前提条件是A必须此时必须在线，否则将不会实时发送给客户端
  private MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULTSource = new Subject<ProtocalModel>();
  public MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULT$ =
    this.MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULTSource.asObservable();

  // 单聊消息
  private MT03_OF_CHATTING_MESSAGESource = new Subject<ProtocalModel>();
  public MT03_OF_CHATTING_MESSAGE$ = this.MT03_OF_CHATTING_MESSAGESource.asObservable();

  //  语音聊天呼叫中：请求语音聊天(发起方A) 客户端主动发，不需要观察
  private MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$ASource = new Subject<ProtocalModel>();
  public MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$A$ = this.MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$ASource.asObservable();

  // 语音聊天呼叫中：取消语音聊天请求(发起发A) 客户端主动发，不需要观察
  private MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$ASource = new Subject<ProtocalModel>();
  public MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$A$ = this.MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$ASource.asObservable();

  // 语音聊天呼叫中：同意语音聊天请求(接收方B) 客户端主动发，不需要观察
  private MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$ASource = new Subject<ProtocalModel>();
  public MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$A$ = this.MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$ASource.asObservable();

  // 更新群管理员的指令
  private UPDATE_GROUP_ADMINSource = new Subject<ProtocalModel>();
  public UPDATE_GROUP_ADMIN$ = this.UPDATE_GROUP_ADMINSource.asObservable();

  // 更新群管理员的指令
  private GROUP_INFO_UPDATESource = new Subject<ProtocalModel>();
  public GROUP_INFO_UPDATE$ = this.GROUP_INFO_UPDATESource.asObservable();

  private illegalMessageSource = new Subject<ProtocalModel>();
  public illegalMessage$ = this.MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$ASource.asObservable();

  // 敏感词更新的指令
  private SENSITIVE_WORD_UPDATESource = new Subject<ProtocalModel>();
  public SENSITIVE_WORD_UPDATE$ = this.SENSITIVE_WORD_UPDATESource.asObservable();

  // 黑名单更新
  private PULLED_BLACK_LISTSource = new Subject<ProtocalModel>();
  public PULLED_BLACK_LIST$ = this.PULLED_BLACK_LISTSource.asObservable();

  // 处理个人禁言的指令
  private GROUP_SILENCESource = new Subject<ProtocalModel>();
  public GROUP_SILENCE$ = this.GROUP_SILENCESource.asObservable();

  // 好友在线状态改变的指令
  private USER_ONLINE_STATUS_CHANGESource = new Subject<ProtocalModel>();
  public USER_ONLINE_STATUS_CHANGE$ = this.USER_ONLINE_STATUS_CHANGESource.asObservable();

  // 自己的用户信息改变的指令
  private USER_INFO_UPDATESource = new Subject<ProtocalModel>();
  public USER_INFO_UPDATE$ = this.USER_INFO_UPDATESource.asObservable();

  // 删除好友
  private DELETE_FRIENDSource = new Subject<ProtocalModel>();
  public DELETE_FRIEND$ = this.DELETE_FRIENDSource.asObservable();

  // 更新APP配置的订阅
  private UPDATE_APP_CONFIGSource = new Subject<ProtocalModel>();
  public UPDATE_APP_CONFIG$ = this.UPDATE_APP_CONFIGSource.asObservable();

  // 踢人删除消息的通知
  private DELETE_FRIEND_FOR_TIRENSource = new Subject<ProtocalModel>();
  public DELETE_FRIEND_FOR_TIRENSource$ = this.DELETE_FRIEND_FOR_TIRENSource.asObservable();

  // 删除单聊消息
  private DELETE_CHAT_MESSAGESource = new Subject<ProtocalModel>();
  public DELETE_CHAT_MESSAGESource$ = this.DELETE_CHAT_MESSAGESource.asObservable();

  constructor() { }

  inceptMessage(originData: ProtocalModel) {
    const typeu = originData.typeu;

    switch (typeu) {
      case UserProtocalsType.MT01_OF_ONLINE_NOTIVICATION:
        this.MT01_OF_ONLINE_NOTIVICATIONSource.next(originData);
        break;
      case UserProtocalsType.MT02_OF_OFFLINE_NOTIVICATION:
        this.MT02_OF_OFFLINE_NOTIVICATIONSource.next(originData);
        break;
      case UserProtocalsType.MT43_OF_TEMP$CHAT$MSG_SERVER$TO$B:
        this.MT43_OF_TEMP$CHAT$MSG_SERVER$TO$BSource.next(originData);
        break;
      case UserProtocalsType.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B:
        this.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$BSource.next(originData);
        break;
      case UserProtocalsType.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER:
        this.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVERSource.next(originData);
        break;
      case UserProtocalsType.MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVER:
        this.MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVERSource.next(originData);
        break;
      case UserProtocalsType.MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVER:
        this.MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVERSource.next(originData);
        break;
      case UserProtocalsType.MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVER:
        this.MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVERSource.next(originData);
        break;
      case UserProtocalsType.MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVER:
        this.MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVERSource.next(originData);
        break;
      case UserProtocalsType.MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVER:
        this.MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVERSource.next(originData);
        break;
      case UserProtocalsType.MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVER:
        this.MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVERSource.next(originData);
        break;
      case UserProtocalsType.MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$A:
        this.MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$ASource.next(originData);
        break;
      case UserProtocalsType.MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$B:
        this.MT07_OF_ADD_FRIEND_REQUEST_INFO_SERVER$TO$BSource.next(originData);
        break;
      case UserProtocalsType.MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENT:
        this.MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENTSource.next(originData);
        break;
      case UserProtocalsType.MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULT:
        this.MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULTSource.next(originData);
        break;
      case UserProtocalsType.MT03_OF_CHATTING_MESSAGE:
        this.MT03_OF_CHATTING_MESSAGESource.next(originData);
        break;
      case UserProtocalsType.MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$A:
        this.MT17_OF_VIDEO$VOICE$REQUEST_REQUESTING$FROM$ASource.next(originData);
        break;
      case UserProtocalsType.MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$A:
        this.MT18_OF_VIDEO$VOICE$REQUEST_ABRORT$FROM$ASource.next(originData);
        break;
      case UserProtocalsType.MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$A:
        this.MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$ASource.next(originData);
        break;
      case UserProtocalsType.UPDATE_GROUP_ADMIN:
        this.UPDATE_GROUP_ADMINSource.next(originData);
        break;
      case UserProtocalsType.SENSITIVE_WORD_UPDATE:
        this.SENSITIVE_WORD_UPDATESource.next(originData);
        break;
      case UserProtocalsType.PULLED_BLACK_LIST:
        this.PULLED_BLACK_LISTSource.next(originData);
        break;
      case UserProtocalsType.GROUP_SILENCE:
        this.GROUP_SILENCESource.next(originData);
        break;
      case UserProtocalsType.USER_ONLINE_STATUS_CHANGE:
        this.USER_ONLINE_STATUS_CHANGESource.next(originData);
        break;
      case UserProtocalsType.USER_INFO_UPDATE:
        this.USER_INFO_UPDATESource.next(originData);
        break;
      case UserProtocalsType.DELETE_FRIEND:
        this.DELETE_FRIENDSource.next(originData);
        break;
      case UserProtocalsType.GROUP_INFO_UPDATE:
        this.GROUP_INFO_UPDATESource.next(originData);
        break;
      case UserProtocalsType.UPDATE_APP_CONFIG:
        this.UPDATE_APP_CONFIGSource.next(originData);
        break;
      case UserProtocalsType.DELETE_FRIEND_FOR_TIREN:
        this.DELETE_FRIEND_FOR_TIRENSource.next(originData);
        break;
      case UserProtocalsType.DELETE_CHAT_MESSAGE:
        this.DELETE_CHAT_MESSAGESource.next(originData);
        break;
      default:
        this.illegalMessageSource.next(originData);
    }

  }

  /**
   * 处理离线指令
   * @param originData
   */
  processOfflineInstruct(originData: ProtocalModel) {
    const typeu = originData.typeu;

    switch (typeu) {
      case UserProtocalsType.MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVER:
        this.MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVERSource.next(originData);
        break;
      case UserProtocalsType.MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVER:
        this.MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVERSource.next(originData);
        break;
      case UserProtocalsType.MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVER:
        this.MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVERSource.next(originData);
        break;
      case UserProtocalsType.MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENT:
        this.MT10_OF_PROCESS_ADD$FRIEND$REQ_FRIEND$INFO$SERVER$TO$CLIENTSource.next(originData);
        break;
      case UserProtocalsType.MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULT:
        this.MT12_OF_PROCESS_ADD$FRIEND$REQ_SERVER$TO$A_REJECT_RESULTSource.next(originData);
        break;
      case UserProtocalsType.DELETE_FRIEND:
        this.DELETE_FRIENDSource.next(originData);
        break;
      case UserProtocalsType.DELETE_FRIEND_FOR_TIREN:
        this.DELETE_FRIEND_FOR_TIRENSource.next(originData);
        break;
      case UserProtocalsType.DELETE_CHAT_MESSAGE:
        this.DELETE_CHAT_MESSAGESource.next(originData);
        break;
      default:
        this.illegalMessageSource.next(originData);
    }
  }
}
