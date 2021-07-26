import {Component, Input, OnInit} from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";

@Component({
  selector: 'app-message-repeal',
  templateUrl: './message-repeal.component.html',
  styleUrls: ['./message-repeal.component.scss']
})
export class MessageRepealComponent implements OnInit {
  @Input() chatMsg: ChatMsgEntity;

  constructor() { }

  ngOnInit(): void {
  }

}
