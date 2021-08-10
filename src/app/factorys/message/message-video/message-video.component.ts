import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

interface VideoInfo {
  fileName: string;
  fileMd5: string;
  src: string;
  fileLength: number;
}

@Component({
  selector: 'app-message-video',
  templateUrl: './message-video.component.html',
  styleUrls: ['./message-video.component.scss']
})
export class MessageVideoComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  public videoInfo: VideoInfo;

  constructor() { }

  ngOnInit(): void {
    this.videoInfo = JSON.parse(this.chatMsg.text);
    this.videoInfo.src = "http://120.79.90.66:8808/ShortVideoDownloader?user_uid=web400070&file_name=" + this.videoInfo.fileName;
  }

}
