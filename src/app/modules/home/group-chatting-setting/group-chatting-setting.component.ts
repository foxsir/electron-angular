import {Component, Input, OnInit} from '@angular/core';
import ChattingModel from "@app/models/chatting.model";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";

@Component({
  selector: 'app-group-chatting-setting',
  templateUrl: './group-chatting-setting.component.html',
  styleUrls: ['./group-chatting-setting.component.scss']
})
export class GroupChattingSettingComponent implements OnInit {
  @Input() currentChat: AlarmItemInterface;

  constructor() { }

  ngOnInit(): void {
  }

}
