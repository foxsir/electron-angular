import {Component, Input, OnInit} from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";

@Component({
  selector: 'app-message-location',
  templateUrl: './message-location.component.html',
  styleUrls: ['./message-location.component.scss']
})
export class MessageLocationComponent implements OnInit {
  @Input() chatMsg: ChatMsgEntity;

  constructor() { }

  ngOnInit(): void {
  }

}
