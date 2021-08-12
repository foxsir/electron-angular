import {Component, Input, OnInit} from '@angular/core';
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";

@Component({
  selector: 'app-chatting-setting',
  templateUrl: './chatting-setting.component.html',
  styleUrls: ['./chatting-setting.component.scss']
})
export class ChattingSettingComponent implements OnInit {
  @Input() currentChat: AlarmItemInterface;

  constructor() { }

  ngOnInit(): void {
  }

}
