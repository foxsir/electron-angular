import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import attachmentIcon from "@app/assets/icons/attachment.svg";
import attachmentActiveIcon from "@app/assets/icons/attachment-active.svg";
import emojiIcon from "@app/assets/icons/emoji.svg";
import emojiActiveIcon from "@app/assets/icons/emoji-active.svg";
import sendIcon from "@app/assets/icons/send.svg";
import sendActiveIcon from "@app/assets/icons/send-active.svg";
import {DomSanitizer} from "@angular/platform-browser";
import ChattingModel from "@app/models/chatting.model";
import {ImService} from "@services/im/im.service";
import {MessageService} from "@services/message/message.service";
import {MsgType} from "@app/config/rbchat-config";
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {RosterProviderService} from "@services/roster-provider/roster-provider.service";
import {AlarmsProviderService} from "@services/alarms-provider/alarms-provider.service";
import {MessageEntityService} from "@services/message-entity/message-entity.service";
import {RestService} from "@services/rest/rest.service";
import {LocalUserService} from "@services/local-user/local-user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-input-area',
  templateUrl: './input-area.component.html',
  styleUrls: ['./input-area.component.scss']
})
export class InputAreaComponent implements OnInit {
  @Input() currentChat: ChattingModel;
  @Output() sendMessage = new EventEmitter<ChatmsgEntityModel>();

  public attachmentIcon = this.dom.bypassSecurityTrustResourceUrl(attachmentIcon);
  public attachmentActiveIcon = this.dom.bypassSecurityTrustResourceUrl(attachmentActiveIcon);
  public emojiIcon = this.dom.bypassSecurityTrustResourceUrl(emojiIcon);
  public emojiActiveIcon = this.dom.bypassSecurityTrustResourceUrl(emojiActiveIcon);
  public sendIcon = this.dom.bypassSecurityTrustResourceUrl(sendIcon);
  public sendActiveIcon = this.dom.bypassSecurityTrustResourceUrl(sendActiveIcon);

  public messageText: string;

  constructor(
    private router: Router,
    private dom: DomSanitizer,
    private imService: ImService,
    private messageService: MessageService,
    private rosterProviderService: RosterProviderService,
    private alarmsProviderService: AlarmsProviderService,
    private messageEntityService: MessageEntityService,
  ) { }

  ngOnInit(): void {
  }

  doSend() {
    //     const message = `{
    // "cy":"0",
    // "f":"400300",
    // "m":"发送给400301的数据",
    // "t":"400301",
    // "ty":"0",
    // "fromUserId":"400300",
    // "m3":"android",
    // "sync":"1"
    // }`;

    // const protocal = this.mbProtocalFactory.createCommonData2(
    //   message, this.imService.getLoginInfo().loginUserId, this.currentChat.dataId, -1
    // );
    // console.dir("ppppppppppppppppppppp");
    // console.dir(protocal);
    // console.dir("ppppppppppppppppppppp");
    //
    // // 将本地发出的消息显示在消息列表
    //
    // // 将消息通过websocket发送出去
    // this.imService.sendData(protocal); // return 0

    if (!this.messageText || this.messageText.trim().length === 0) {
      return;
    }

    if(!this.imService.isLogined()) {
      return this.router.navigate(['/session/login']).then(() => {
        // goto login page
      });
    }

    this.messageService.sendMessage(MsgType.TYPE_TEXT, this.currentChat.dataId, this.messageText).then(res => {
      if(res.success === true) {
        const friendUid = this.currentChat.dataId;
        const ree = this.rosterProviderService.getFriendInfoByUid(friendUid);

        // 自已发出的消息，也要显示在相应的UI界面上
        const message = res.msgBody.m;
        const alarmMessageDTO = this.alarmsProviderService.createChatMsgAlarmForLocal(res.msgBody.ty, message, "ree.nickname", friendUid);

        //111 新增指纹码 he 消息类型msgType
        // debugger
        const chatMsgEntity = this.messageEntityService.prepareSendedMessage(
          message, 0, res.fingerPrint, MsgType.TYPE_TEXT, MsgType.TYPE_TEXT.toString()
        );
        this.sendMessage.emit(chatMsgEntity);
      }
    });
  }
}
