import {Component, Input, OnInit} from '@angular/core';
import CollectModel from "@app/models/collect.model";
import {MsgType} from "@app/config/rbchat-config";

@Component({
  selector: 'app-collect-factory',
  templateUrl: './collect-factory.component.html',
  styleUrls: ['./collect-factory.component.scss']
})
export class CollectFactoryComponent implements OnInit {
  @Input() collect: CollectModel;
  public msgType = MsgType;

  constructor() { }

  ngOnInit(): void {
  }

}
