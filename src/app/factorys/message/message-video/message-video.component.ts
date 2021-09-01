import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {FileService} from "@services/file/file.service";
import DirectoryType from "@services/file/config/DirectoryType";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

interface VideoInfo {
  fileName: string;
  ossFilePath: string;
  fileMd5: string;
  fileLength: number;
  videoCoverPath: string;
}

@Component({
  selector: 'app-message-video',
  templateUrl: './message-video.component.html',
  styleUrls: ['./message-video.component.scss']
})
export class MessageVideoComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  public videoInfo: VideoInfo;
  public videoResource: SafeResourceUrl;

  constructor(
    private fileService: FileService,
    private dom: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.videoInfo = JSON.parse(this.chatMsg.text);
    // const src = this.fileService.getFileUrl([DirectoryType.OSS_VIDEO, this.videoInfo.fileName].join("/"));
    // this.videoResource = this.dom.bypassSecurityTrustResourceUrl(src);
  }

}
