import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageTextComponent } from './message-text/message-text.component';
import { MessageImageComponent } from './message-image/message-image.component';
import { MessageVoiceComponent } from './message-voice/message-voice.component';
import { MessageFileComponent } from './message-file/message-file.component';
import { MessageVideoComponent } from './message-video/message-video.component';
import { MessageContactComponent } from './message-contact/message-contact.component';
import { MessageLocationComponent } from './message-location/message-location.component';
import { MessageRedEnvelopeComponent } from './message-red-envelope/message-red-envelope.component';
import { MessageRepealComponent } from './message-repeal/message-repeal.component';
import { MessageGetRedEnvelopeComponent } from './message-get-red-envelope/message-get-red-envelope.component';
import { MessageTransferComponent } from './message-transfer/message-transfer.component';
import { MessageAtComponent } from './message-at/message-at.component';
import { MessageDismissComponent } from './message-dismiss/message-dismiss.component';
import { MessageSystemComponent } from './message-system/message-system.component';
import { MessageFactoryComponent } from './message-factory/message-factory.component';
import { MessageNoTalkComponent } from './message-no-talk/message-no-talk.component';
import { MessageBackComponent } from './message-back/message-back.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatDividerModule} from "@angular/material/divider";
import {MatButtonModule} from "@angular/material/button";
import { MessageMergeMultipleComponent } from './message-merge-multiple/message-merge-multiple.component';
import { MessageVoiceCallComponent } from './message-voice-call/message-voice-call.component';

@NgModule({
  declarations: [
    MessageTextComponent,
    MessageImageComponent,
    MessageVoiceComponent,
    MessageFileComponent,
    MessageVideoComponent,
    MessageContactComponent,
    MessageLocationComponent,
    MessageRedEnvelopeComponent,
    MessageRepealComponent,
    MessageGetRedEnvelopeComponent,
    MessageTransferComponent,
    MessageAtComponent,
    MessageDismissComponent,
    MessageSystemComponent,
    MessageFactoryComponent,
    MessageNoTalkComponent,
    MessageBackComponent,
    MessageMergeMultipleComponent,
    MessageVoiceCallComponent
  ],
  exports: [
    MessageFactoryComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatDividerModule,
    MatButtonModule,
  ]
})
export class MessageModule { }
