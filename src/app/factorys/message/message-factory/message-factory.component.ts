import {Component, Injector, Input, OnInit} from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";
import {MsgType} from "@app/config/rbchat-config";

import {MessageAtComponent} from '../message-at/message-at.component';
import {MessageContactComponent} from '../message-contact/message-contact.component';
import {MessageDismissComponent} from '../message-dismiss/message-dismiss.component';
import {MessageFileComponent} from '../message-file/message-file.component';
import {MessageGetRedEnvelopeComponent} from '../message-get-red-envelope/message-get-red-envelope.component';
import {MessageImageComponent} from '../message-image/message-image.component';
import {MessageLocationComponent} from '../message-location/message-location.component';
import {MessageRedEnvelopeComponent} from '../message-red-envelope/message-red-envelope.component';
import {MessageSystemComponent} from '../message-system/message-system.component';
import {MessageTextComponent} from '../message-text/message-text.component';
import {MessageTransferComponent} from '../message-transfer/message-transfer.component';
import {MessageVideoComponent} from '../message-video/message-video.component';
import {MessageVoiceComponent} from '../message-voice/message-voice.component';
import {MessageNoTalkComponent} from "../message-no-talk/message-no-talk.component";
import {MessageRepealComponent} from "../message-repeal/message-repeal.component";


@Component({
  selector: 'app-message-factory',
  templateUrl: './message-factory.component.html',
  styleUrls: ['./message-factory.component.scss']
})
export class MessageFactoryComponent implements OnInit {
  @Input() chatMsg: ChatMsgEntity;

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
