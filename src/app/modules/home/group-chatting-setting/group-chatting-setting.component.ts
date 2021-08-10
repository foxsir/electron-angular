import {Component, Input, OnInit} from '@angular/core';
import ChattingModel from "@app/models/chatting.model";

@Component({
  selector: 'app-group-chatting-setting',
  templateUrl: './group-chatting-setting.component.html',
  styleUrls: ['./group-chatting-setting.component.scss']
})
export class GroupChattingSettingComponent implements OnInit {
  @Input() currentChat: ChattingModel;

  constructor() { }

  ngOnInit(): void {
  }

}
