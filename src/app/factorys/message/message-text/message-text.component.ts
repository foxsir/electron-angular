import {Component, Inject, Input, OnInit} from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";

@Component({
  selector: 'app-message-text',
  templateUrl: './message-text.component.html',
  styleUrls: ['./message-text.component.scss']
})
export class MessageTextComponent implements OnInit {
  @Input() chatMsg: ChatMsgEntity;

  constructor(){
  }

  ngOnInit() {
  }

}
