import {Component, Input, OnInit} from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import MergeTransferModel from "@app/models/merge-transfer.model";
import {MessageMergeMultipleComponent} from "@app/factorys/message/message-merge-multiple/message-merge-multiple.component";
import {DialogService} from "@services/dialog/dialog.service";
import MessageTypeTips from "@app/config/message-type-tips";

@Component({
  selector: 'app-message-transfer',
  templateUrl: './message-transfer.component.html',
  styleUrls: ['./message-transfer.component.scss']
})
export class MessageTransferComponent implements OnInit {
  @Input() chatMsg: ChatmsgEntityModel;
  public mergeTransfer: MergeTransferModel;

  public messageType = MessageTypeTips;

  constructor(
    private dialogService: DialogService
  ) {
  }

  ngOnInit(): void {
    this.mergeTransfer = JSON.parse(this.chatMsg.text);
  }

  showMultipleMessage() {
    this.dialogService.openDialog(MessageMergeMultipleComponent, {
      data: this.mergeTransfer.messages,
      width: '430px'
    }).then();
  }

}
