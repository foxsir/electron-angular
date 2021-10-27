import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {FileService} from "@services/file/file.service";
import {ElementService} from "@services/element/element.service";
import {Tag} from "@angular/compiler/src/i18n/serializers/xml_helper";

@Component({
  selector: 'app-message-voice',
  templateUrl: './message-voice.component.html',
  styleUrls: ['./message-voice.component.scss']
})
export class MessageVoiceComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  public resource: SafeResourceUrl;

  public base64PreFix = "data:audio/wav;base64,";

  constructor(
    private dom: DomSanitizer,
    private fileService: FileService,
    private elementService: ElementService
  ) { }

  ngOnInit(): void {
    this.fileService.amr2mp3(this.chatMsg.text.split("_Voice_")[1]).then((res: any) => {
      this.resource = this.dom.bypassSecurityTrustResourceUrl([this.base64PreFix, res.data].join(""));
    });
  }

  playing(tag: HTMLAudioElement) {
    this.elementService.oncePLayAudio(tag);
  }

}
