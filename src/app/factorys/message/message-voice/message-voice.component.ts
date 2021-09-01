import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

import {FileService} from "@services/file/file.service";

@Component({
  selector: 'app-message-voice',
  templateUrl: './message-voice.component.html',
  styleUrls: ['./message-voice.component.scss']
})
export class MessageVoiceComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  public resource: SafeResourceUrl;

  constructor(
    private dom: DomSanitizer,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    // this.resource = this.dom.bypassSecurityTrustResourceUrl(
    //   this.chatMsg.text.split("_Voice_")[1]
    // );
    this.resource = this.dom.bypassSecurityTrustResourceUrl(
      this.chatMsg.text.split("_Voice_")[1]
    );

    this.fileService.getFile("message_voice/2021-08-31-6460_151a1b45dbad6e58884eb01d50b13580.amr").then(res => {
      // let s: string = res.content;
    });

  }

}
