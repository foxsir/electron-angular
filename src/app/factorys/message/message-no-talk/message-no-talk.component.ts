import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

@Component({
  selector: 'app-message-no-talk',
  templateUrl: './message-no-talk.component.html',
  styleUrls: ['./message-no-talk.component.scss']
})
export class MessageNoTalkComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;

  constructor() { }

  ngOnInit(): void {
  }

}
