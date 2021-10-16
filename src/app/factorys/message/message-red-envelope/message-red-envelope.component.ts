import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {DomSanitizer} from "@angular/platform-browser";

import redBagIcon from "@app/assets/icons/red-bag.svg";

import {RedPacketResponseInterface} from "@app/interfaces/red-packet-response.interface";
import {DialogService} from "@services/dialog/dialog.service";
import {RedBagComponent} from "@modules/user-dialogs/red-bag/red-bag.component";

@Component({
  selector: 'app-message-red-envelope',
  templateUrl: './message-red-envelope.component.html',
  styleUrls: ['./message-red-envelope.component.scss']
})
export class MessageRedEnvelopeComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  public redBag: RedPacketResponseInterface;

  public redBagIcon = this.dom.bypassSecurityTrustResourceUrl(redBagIcon);

  constructor(
    private dom: DomSanitizer,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.redBag = JSON.parse(this.chatMsg.text);
  }

  openRedBag() {
    this.dialogService.openDialog(RedBagComponent,{data: this.chatMsg}).then(res => {

    });
  }

}
