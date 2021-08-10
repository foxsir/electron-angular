import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";

@Component({
  selector: 'app-message-dismiss',
  templateUrl: './message-dismiss.component.html',
  styleUrls: ['./message-dismiss.component.scss']
})
export class MessageDismissComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;

  constructor() { }

  ngOnInit(): void {
  }

}
