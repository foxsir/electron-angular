import {AfterContentInit, AfterViewInit, Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import CommonTools from "@app/common/common.tools";
import {FileService} from "@services/file/file.service";
import {DomSanitizer, SafeResourceUrl, SafeUrl} from "@angular/platform-browser";
import {DialogService} from "@services/dialog/dialog.service";
import {PreviewMediaComponent} from "@modules/user-dialogs/preview-media/preview-media.component";

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
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.blobUrl = this.dom.bypassSecurityTrustResourceUrl(this.chatMsg.text);
  }

  download() {
    CommonTools.downloadLink(this.chatMsg.text, "download.png");
  }

  preview() {
    this.dialogService.openDialog(PreviewMediaComponent, {
      data: {type: 'image', url: this.blobUrl},
      panelClass: "padding-less-dialog",
    }).then(() => {});
  }


}
