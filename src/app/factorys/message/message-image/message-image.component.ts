import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {ImageTools} from "@app/common/image.tools";

@Component({
  selector: 'app-message-image',
  templateUrl: './message-image.component.html',
  styleUrls: ['./message-image.component.scss']
})
export class MessageImageComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  public imageTools = new ImageTools();

  constructor() { }

  ngOnInit(): void {
  }

}
