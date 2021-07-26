import {Component, Input, OnInit} from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";

@Component({
  selector: 'app-message-image',
  templateUrl: './message-image.component.html',
  styleUrls: ['./message-image.component.scss']
})
export class MessageImageComponent implements OnInit {
  @Input() chatMsg: ChatMsgEntity;

  constructor() { }

  ngOnInit(): void {
  }

}
