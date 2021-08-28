import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import CommonTools from "@app/common/common.tools";
import FileMetaInterface from "@app/interfaces/file-meta.interface";

@Component({
  selector: 'app-message-file',
  templateUrl: './message-file.component.html',
  styleUrls: ['./message-file.component.scss']
})
export class MessageFileComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  public fileInfo: FileMetaInterface;
  public commonTools = CommonTools;

  constructor(
  ) { }

  ngOnInit(): void {
    this.fileInfo = JSON.parse(this.chatMsg.text);
  }

  downloadFile() {
    CommonTools.downloadLink(this.fileInfo.ossFilePath, this.fileInfo.fileName);
  }

}
