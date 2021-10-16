import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

@Component({
  selector: 'app-message-notice',
  templateUrl: './message-notice.component.html',
  styleUrls: ['./message-notice.component.scss']
})
export class MessageNoticeComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;

  constructor() { }

  ngOnInit(): void {
  }

}
