import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectFactoryComponent } from './collect-factory/collect-factory.component';
import { CollectFileComponent } from './collect-file/collect-file.component';
import { CollectImageComponent } from './collect-image/collect-image.component';
import { CollectTextComponent } from './collect-text/collect-text.component';
import { CollectVoiceComponent } from './collect-voice/collect-voice.component';
import { CollectVideoComponent } from './collect-video/collect-video.component';
import { CollectContactComponent } from './collect-contact/collect-contact.component';
import { CollectLocationComponent } from './collect-location/collect-location.component';
import { CollectRedEnvelopeComponent } from './collect-red-envelope/collect-red-envelope.component';
import { CollectRepealComponent } from './collect-repeal/collect-repeal.component';
import { CollectNoTalkComponent } from './collect-no-talk/collect-no-talk.component';
import { CollectAtComponent } from './collect-at/collect-at.component';
import { CollectQuoteComponent } from './collect-quote/collect-quote.component';
import { CollectVoiceCallComponent } from './collect-voice-call/collect-voice-call.component';
import { CollectSystemComponent } from './collect-system/collect-system.component';

@NgModule({
  declarations: [
    CollectFactoryComponent,
    CollectFileComponent,
    CollectImageComponent,
    CollectTextComponent,
    CollectVoiceComponent,
    CollectVideoComponent,
    CollectContactComponent,
    CollectLocationComponent,
    CollectRedEnvelopeComponent,
    CollectRepealComponent,
    CollectNoTalkComponent,
    CollectAtComponent,
    CollectQuoteComponent,
    CollectVoiceCallComponent,
    CollectSystemComponent
  ],
  exports: [CollectFactoryComponent],
  imports: [
    CommonModule
  ]
})
export class CollectContentModule { }
