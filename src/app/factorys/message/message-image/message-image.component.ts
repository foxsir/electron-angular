import {Component, Input, OnInit} from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";
import {ImageTools} from "@app/common/image.tools";

@Component({
  selector: 'app-message-image',
  templateUrl: './message-image.component.html',
  styleUrls: ['./message-image.component.scss']
})
export class MessageImageComponent implements OnInit {
  @Input() chatMsg: ChatMsgEntity;
  public imageTools = new ImageTools();

  constructor() { }

  ngOnInit(): void {
  }

}
