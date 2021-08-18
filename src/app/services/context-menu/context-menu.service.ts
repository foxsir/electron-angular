import { Injectable } from '@angular/core';
import ChatmsgEntityModel from "@app/models/chatmsg-entity.model";
import {MsgType} from "@app/config/rbchat-config";
import {ContextMenuModel, ContextMenuChattingModel} from "@app/models/context-menu.model";
import {Clipboard} from "@angular/cdk/clipboard";
import {QuoteMessageService} from "@services/quote-message/quote-message.service";
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  public msgType = MsgType;

  private contextMenu: ContextMenuModel[][] = [];

  private contextMenuForChatting: ContextMenuChattingModel[] = [];

  private common = ['common'];
  private commonManage = ['common', 'manage'];
  private commonManageOwner = ['common', 'manage', 'owner'];

  private actionChattingCollection = {
    copyText: {
      label: "复制",
      limits: this.common,
      action: (chatting: AlarmItemInterface, chattingList: AlarmItemInterface[]) => {
        alert(chattingList.indexOf(chatting));
      }
    },
  };

  private actionCollection = {
    copyText: {
      label: "复制",
      limits: this.common,
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.copyTextToClipboard(messageContainer);
      }
    },
    copyImage: {
      label: "复制",
      limits: this.common,
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        this.copyImageToClipboard(messageContainer);
      }
    },
    repeal: {
      label: "撤回",
      limits: this.common,
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        chat.msgType = this.msgType.TYPE_BACK;
      }
    },
    quote: {
      label: "回复",
      limits: this.common,
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        // chat.msgType = this.msgType.TYPE_BACK;
        this.quoteMessageService.setQuoteMessage(chat);
      }
    },
    download: {
      label: "下载",
      limits: this.common,
      action: (chat: ChatmsgEntityModel, messageContainer: HTMLDivElement) => {
        alert("下载文件");
        // chat.msgType = this.msgType.TYPE_BACK;
        // this.quoteMessageService.setQuoteMessage(chat);
      }
    },
  };

  constructor(
    private quoteMessageService: QuoteMessageService,
  ) {
    this.initMenu();
  }

  private initMenu() {
    this.contextMenu[this.msgType.TYPE_TEXT] = [
      this.actionCollection.copyText,
      this.actionCollection.quote,
      this.actionCollection.repeal,
    ];

    this.contextMenu[this.msgType.TYPE_FILE] = [
      this.actionCollection.download,
      this.actionCollection.quote,
      this.actionCollection.repeal,
    ];

    this.contextMenu[this.msgType.TYPE_IMAGE] = [
      this.actionCollection.copyImage,
      this.actionCollection.quote,
      this.actionCollection.repeal,
    ];

    this.contextMenuForChatting = [
      this.actionChattingCollection.copyText
    ];
  }

  copyTextToClipboard(messageContainer) {
    try {
      const blob = new Blob([messageContainer.innerText], { type: 'text/plain' });
      this.setToClipboard(blob);
    } catch (error) {
      console.error('Something wrong happened');
    }
  }

  copyImageToClipboard(messageContainer) {
    // take any image
    const img = messageContainer.querySelector("img");
    // make <canvas> of the same size
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const context = canvas.getContext('2d');

    // copy image to it (this method allows to cut image)
    context.drawImage(img, 0, 0);

    // toBlob is async operation, callback is called when done
    canvas.toBlob((blob) => {
      try {
        this.setToClipboard(blob);
      } catch (error) {
        console.error('Something wrong happened');
        console.error(error);
      }
    }, 'image/png'); // 只支持png
  }

  setToClipboard(blob) {
    const data = [new ClipboardItem({ [blob.type]: blob })];
    return navigator.clipboard.write(data);
  }

  getContextMenuForMessage(chat: ChatmsgEntityModel, chatOwner: any = null) {
    // chat.msgType
    return this.contextMenu[chat.msgType] || [];
  }

  getContextMenuForChatting(chatting: AlarmItemInterface, chatOwner: any = null) {
    return this.contextMenuForChatting;
  }

  getContextMenuForAvatar(chat: ChatmsgEntityModel, chatOwner) {

  }

}
