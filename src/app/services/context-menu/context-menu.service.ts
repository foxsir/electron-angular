import { Injectable } from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";
import {MsgType} from "@app/config/rbchat-config";
import ContextMenu from "@app/models/ContextMenu";
import {Clipboard} from "@angular/cdk/clipboard";

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  public msgType = MsgType;

  private contextMenu: ContextMenu[][] = [];

  private common = ['common'];
  private commonManage = ['common', 'manage'];
  private commonManageOwner = ['common', 'manage', 'owner'];

  private actionCollection = {
    copyText: {
      label: "复制",
      limits: this.common,
      action: (chat: ChatMsgEntity, messageContainer: HTMLDivElement) => {
        this.copyTextToClipboard(messageContainer);
      }
    },
    copyImage: {
      label: "复制",
      limits: this.common,
      action: (chat: ChatMsgEntity, messageContainer: HTMLDivElement) => {
        this.copyImageToClipboard(messageContainer);
      }
    },
    repeal: {
      label: "撤回",
      limits: this.common,
      action: (chat: ChatMsgEntity, messageContainer: HTMLDivElement) => {
        chat.msgType = this.msgType.TYPE_BACK;
      }
    },
  };

  constructor() {
    this.initMenu();
  }

  private initMenu() {
    this.contextMenu[this.msgType.TYPE_TEXT] = [
      this.actionCollection.copyText,
      this.actionCollection.repeal,
    ];

    this.contextMenu[this.msgType.TYPE_IMAGE] = [
      this.actionCollection.copyImage,
      this.actionCollection.repeal,
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

  getContextMenuForChat(chat: ChatMsgEntity, chatOwner: any = null) {
    // chat.msgType
    return this.contextMenu[chat.msgType] || [];
  }

  getContextMenuForAvatar(chat: ChatMsgEntity, chatOwner) {

  }

}
