import { Injectable } from '@angular/core';
import {MsgType} from "@app/config/rbchat-config";
import {ProtocalModel, ProtocalModelDataContent} from "@app/models/protocal.model";

@Injectable({
  providedIn: 'root'
})
export class ServerForwardService {

  public functions = {
    [MsgType.TYPE_BACK]: this.backMessage.bind(this),
    [MsgType.TYPE_TIREN]: this.tiRenMessage.bind(this),
    [MsgType.TYPE_SYSTEAM$INFO]: this.systemMessage.bind(this),
    [MsgType.TYPE_READED]: this.readedStatus.bind(this),
  };

  constructor() { }

  backMessage(res: ProtocalModel) {
    const dataContent: ProtocalModelDataContent = JSON.parse(res.dataContent);
    const msg = JSON.parse(dataContent.m);
    console.log(msg.uuid);
  }

  tiRenMessage(res: ProtocalModel) {
    console.dir(res);
  }

  systemMessage(res: ProtocalModel) {
    console.dir(res);
  }

  readedStatus(res: ProtocalModel) {
    console.dir(res);
  }

}
