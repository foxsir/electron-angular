import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import CommonTools from "@app/common/common.tools";
import {FileService} from "@services/file/file.service";
import {DomSanitizer, SafeResourceUrl, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-message-image',
  templateUrl: './message-image.component.html',
  styleUrls: ['./message-image.component.scss']
})
export class MessageImageComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  public blobUrl: SafeResourceUrl;

  constructor(
    public fileService: FileService,
    private dom: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.blobUrl = this.dom.bypassSecurityTrustResourceUrl(this.chatMsg.text);
  }

  download() {
    CommonTools.downloadLink(this.chatMsg.text, "download.png");
  }

}
