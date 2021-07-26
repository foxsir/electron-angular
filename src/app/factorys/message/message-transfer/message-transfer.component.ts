import {Component, Input, OnInit} from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";

@Component({
  selector: 'app-message-transfer',
  templateUrl: './message-transfer.component.html',
  styleUrls: ['./message-transfer.component.scss']
})
export class MessageTransferComponent implements OnInit {
  @Input() chatMsg: ChatMsgEntity;

  constructor() { }

  ngOnInit(): void {
  }

}
