import {Component, Input, OnInit} from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";

@Component({
  selector: 'app-message-dismiss',
  templateUrl: './message-dismiss.component.html',
  styleUrls: ['./message-dismiss.component.scss']
})
export class MessageDismissComponent implements OnInit {
  @Input() chatMsg: ChatMsgEntity;

  constructor() { }

  ngOnInit(): void {
  }

}
