import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

interface FileInfo {
  fileName: string;
  fileMd5: string;
  fileLength: number;
  src: string;
}

@Component({
  selector: 'app-message-file',
  templateUrl: './message-file.component.html',
  styleUrls: ['./message-file.component.scss']
})
export class MessageFileComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  public fileInfo: FileInfo;

  constructor() { }

  ngOnInit(): void {
    this.fileInfo = JSON.parse(this.chatMsg.text);
  }

}
