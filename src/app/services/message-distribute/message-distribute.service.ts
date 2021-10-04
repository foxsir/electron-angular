import { Injectable } from '@angular/core';
import {ProtocalModel} from "@app/models/protocal.model";
import {Subject} from "rxjs";
import {UserProtocalsType} from "@app/config/rbchat-config";

@Injectable({
  providedIn: 'root'
})
export class MessageDistributeService {

  private MT01_OF_ONLINE_NOTIVICATIONSource = new Subject<ProtocalModel>();
  public MT01_OF_ONLINE_NOTIVICATION$ = this.MT01_OF_ONLINE_NOTIVICATIONSource.asObservable();

  private MT02_OF_OFFLINE_NOTIVICATIONSource = new Subject<ProtocalModel>();
  public MT02_OF_OFFLINE_NOTIVICATION$ = this.MT02_OF_OFFLINE_NOTIVICATIONSource.asObservable();

  private MT43_OF_TEMP$CHAT$MSG_SERVER$TO$BSource = new Subject<ProtocalModel>();
  public MT43_OF_TEMP$CHAT$MSG_SERVER$TO$B$ = this.MT43_OF_TEMP$CHAT$MSG_SERVER$TO$BSource.asObservable();

  private MT45_OF_GROUP$CHAT$MSG_SERVER$TO$BSource = new Subject<ProtocalModel>();
  public MT45_OF_GROUP$CHAT$MSG_SERVER$TO$B$ = this.MT45_OF_GROUP$CHAT$MSG_SERVER$TO$BSource.asObservable();

  private MT44_OF_GROUP$CHAT$MSG_A$TO$SERVERSource = new Subject<ProtocalModel>();
  public MT44_OF_GROUP$CHAT$MSG_A$TO$SERVER$ = this.MT44_OF_GROUP$CHAT$MSG_A$TO$SERVERSource.asObservable();

  private MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVERSource = new Subject<ProtocalModel>();
  public MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVER$ = this.MT46_OF_GROUP$SYSCMD_MYSELF$BE$INVITE_FROM$SERVERSource.asObservable();

  private MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVERSource = new Subject<ProtocalModel>();
  public MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVER$ = this.MT47_OF_GROUP$SYSCMD_COMMON$INFO_FROM$SERVERSource.asObservable();

  private MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVERSource = new Subject<ProtocalModel>();
  public MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVER$ = this.MT48_OF_GROUP$SYSCMD_DISMISSED_FROM$SERVERSource.asObservable();

  private MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVERSource = new Subject<ProtocalModel>();
  public MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVER$ = this.MT49_OF_GROUP$SYSCMD_YOU$BE$KICKOUT_FROM$SERVERSource.asObservable();

  private MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVERSource = new Subject<ProtocalModel>();
  public MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVER$ = this.MT50_OF_GROUP$SYSCMD_SOMEONEB$REMOVED_FROM$SERVERSource.asObservable();

  private MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVERSource = new Subject<ProtocalModel>();
  public MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVER$ =
    this.MT51_OF_GROUP$SYSCMD_GROUP$NAME$CHANGED_FROM$SERVERSource.asObservable();

  private MT06_OF_ADD_FRIEND_REQUEST_RESPONSE$FOR$ERROR_SERVER$TO$ASource = new Subject<ProtocalModel>();
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

  private UPDATE_GROUP_ADMINSource = new Subject<ProtocalModel>();
  public UPDATE_GROUP_ADMIN$ = this.UPDATE_GROUP_ADMINSource.asObservable();

  private illegalMessageSource = new Subject<ProtocalModel>();
  public illegalMessage$ = this.MT19_OF_VIDEO$VOICE$REQUEST_ACCEPT$TO$ASource.asObservable();

  private SENSITIVE_WORD_UPDATESource = new Subject<ProtocalModel>();
  public SENSITIVE_WORD_UPDATE$ = this.SENSITIVE_WORD_UPDATESource.asObservable();

  private PULLED_BLACK_LISTSource = new Subject<ProtocalModel>();
  public PULLED_BLACK_LIST$ = this.PULLED_BLACK_LISTSource.asObservable();

  private GROUP_SILENCESource = new Subject<ProtocalModel>();
  public GROUP_SILENCE$ = this.GROUP_SILENCESource.asObservable();

  private GROUP_ALL_SILENCESource = new Subject<ProtocalModel>();
  public GROUP_ALL_SILENCE$ = this.GROUP_ALL_SILENCESource.asObservable();

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
      case UserProtocalsType.MT16_OF_VIDEO$VOICE_SWITCH$TO$VOICE$AND$VIDEO:
        this.MT16_OF_VIDEO$VOICE_SWITCH$TO$VOICE$AND$VIDEOSource.next(originData);
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
      default:
        this.illegalMessageSource.next(originData);
    }

  }

}
