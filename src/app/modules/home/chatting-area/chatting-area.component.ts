import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {AvatarService} from "@services/avatar/avatar.service";

import {formatDate} from "@app/libs/mobileimsdk-client-common";

import settingIcon from "@app/assets/icons/setting.svg";
import settingActiveIcon from "@app/assets/icons/setting-active.svg";
import searchIcon from "@app/assets/icons/search.svg";
import searchActiveIcon from "@app/assets/icons/search-active.svg";
import voiceIcon from "@app/assets/icons/voice.svg";
import voiceActiveIcon from "@app/assets/icons/voice-active.svg";
import closeCircleIcon from "@app/assets/icons/close-circle.svg";
import closeCircleActiveIcon from "@app/assets/icons/close-circle-active.svg";

import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {QuoteMessageService} from "@services/quote-message/quote-message.service";
import LocalUserinfoModel from "@app/models/local-userinfo.model";
import {LocalUserService} from "@services/local-user/local-user.service";
import {MatMenuTrigger} from "@angular/material/menu";
import {ContextMenuModel} from "@app/models/context-menu.model";
import {ContextMenuService} from "@services/context-menu/context-menu.service";

@Component({
  selector: 'app-chatting-area',
  templateUrl: './chatting-area.component.html',
  styleUrls: ['./chatting-area.component.scss']
})
export class ChattingAreaComponent implements OnInit {
  @Input() currentChat: AlarmItemInterface;
  @ViewChild("chattingContainer") chattingContainer: ElementRef;

  public formatDate = formatDate;

  // icon
  public closeCircleIcon = this.dom.bypassSecurityTrustResourceUrl(closeCircleIcon);
  public closeCircleActiveIcon = this.dom.bypassSecurityTrustResourceUrl(closeCircleActiveIcon);
  public settingIcon = this.dom.bypassSecurityTrustResourceUrl(settingIcon);
  public settingActiveIcon = this.dom.bypassSecurityTrustResourceUrl(settingActiveIcon);
  public searchIcon = this.dom.bypassSecurityTrustResourceUrl(searchIcon);
  public searchActiveIcon = this.dom.bypassSecurityTrustResourceUrl(searchActiveIcon);
  public voiceIcon = this.dom.bypassSecurityTrustResourceUrl(voiceIcon);
  public voiceActiveIcon = this.dom.bypassSecurityTrustResourceUrl(voiceActiveIcon);
  // end icon

  public currentChatAvatar: SafeResourceUrl;
  public currentChatSubtitle: string = null;
  public chatMsgEntityList: ChatmsgEntityModel[];

  public localUserInfo: LocalUserinfoModel;

  // 是否正在搜索
  public searching = false;

  // 引用回复消息
  public quoteMessage: ChatmsgEntityModel = null;

  // 右键菜单
  public contextMenu: ContextMenuModel[] = [];

  constructor(
    private avatarService: AvatarService,
    private dom: DomSanitizer,
    private localUserService: LocalUserService,
    private contextMenuService: ContextMenuService,
    private quoteMessageService: QuoteMessageService,
  ) {
    this.localUserInfo = this.localUserService.localUserInfo;
  }

  ngOnInit(): void {
    this.avatarService.getAvatar(this.currentChat.alarmItem.dataId).then(url => {
      this.currentChatAvatar = this.dom.bypassSecurityTrustResourceUrl(url);
    });

    this.subscribeQuote();
  }

  pushMessageToPanel(chat: ChatmsgEntityModel) {
    if(this.chatMsgEntityList) {
      this.chatMsgEntityList.push(chat);
      this.scrollToBottom();
    }
    // chatMsg.fingerPrintOfProtocal
  }

  private subscribeQuote() {
    this.quoteMessageService.message$.subscribe((meg) => {
      this.quoteMessage = meg;
      this.scrollToBottom();
    });
  }

  clearSubscribeQuote() {
    this.quoteMessageService.setQuoteMessage(null);
  }

  scrollToBottom(behavior: "auto" | "smooth" = "smooth") {
    setTimeout(() => {
      this.chattingContainer.nativeElement.lastElementChild?.scrollIntoView({
        behavior: behavior, block: "start"
      });
    }, 500);
  }

  contextMenuForMessage(e: MouseEvent, menu: MatMenuTrigger, span: HTMLSpanElement, chat: ChatmsgEntityModel) {
    this.contextMenu = this.contextMenuService.getContextMenuForMessage(chat);
    menu.openMenu();
    span.style.position = "fixed";
    span.style.top = "0px";
    span.style.left = "0px";
    span.style.transform = `translate3d(${e.pageX}px, ${e.pageY}px, 0px)`;
    return e.defaultPrevented;
  }

}
