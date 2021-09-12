import {Component, Injector, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {MsgType} from "@app/config/rbchat-config";

@Component({
  selector: 'app-message-factory',
  templateUrl: './message-factory.component.html',
  styleUrls: ['./message-factory.component.scss']
})
export class MessageFactoryComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  @Input() wrapDiv: HTMLDivElement;

  // private chatMsgTemplate = {
  //   [MsgType.TYPE_AITE]: MessageAtComponent,
  //   [MsgType.TYPE_CONTACT]: MessageContactComponent,
  //   [MsgType.TYPE_TIREN]: MessageDismissComponent,
  //   [MsgType.TYPE_FILE]: MessageFileComponent,
  //   [MsgType.TYPE_GETREDBAG]: MessageGetRedEnvelopeComponent,
  //   [MsgType.TYPE_IMAGE]: MessageImageComponent,
  //   [MsgType.TYPE_LOCATION]: MessageLocationComponent,
  //   [MsgType.TYPE_REDBAG]: MessageRedEnvelopeComponent,
  //   [MsgType.TYPE_BACK]: MessageRepealComponent,
  //   [MsgType.TYPE_NOTALK]: MessageNoTalkComponent,
  //   [MsgType.TYPE_SYSTEAM$INFO]: MessageSystemComponent,
  //   [MsgType.TYPE_TEXT]: MessageTextComponent,
  //   [MsgType.TYPE_TRANSFER]: MessageTransferComponent,
  //   [MsgType.TYPE_SHORTVIDEO]: MessageVideoComponent,
  //   [MsgType.TYPE_VOICE]: MessageVoiceComponent,
  // };

  // component = MessageTextComponent;

  public msgType = MsgType;

  constructor() {
  }

  ngOnInit(): void {
  }

}
