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
    //     // take any image
    //     let img = temp1;
    //
    // // make <canvas> of the same size
    //     let canvas = document.createElement('canvas');
    //     canvas.width = img.naturalWidth;
    //     canvas.height = img.naturalHeight;
    //
    //     let context = canvas.getContext('2d');
    //
    // // copy image to it (this method allows to cut image)
    //     context.drawImage(img, 0, 0);
    //
    // // we can context.rotate(), and do many other things on canvas
    //
    // // toBlob is async operation, callback is called when done
    //     canvas.toBlob(function(blob) {
    //       // blob ready, download it
    //       console.dir(blob.arrayBuffer());
    //
    //       var reader = new FileReader();
    //       reader.readAsDataURL(blob);
    //       reader.onloadend = function() {
    //         var base64data = reader.result;
    //         console.log(base64data);base64data
    //       }
    //
    //
    //     }, 'image/png');

    // document.addEventListener('DOMContentLoaded', async function () {
    //   const copyTextBtn = document.getElementById('copy-text-btn')
    //   const copyImgBtn = document.getElementById('copy-img-btn')
    //   const canWriteEl = document.getElementById('can-write')
    //   const textarea = document.querySelector('textarea')
    //   const img = document.querySelector('img')
    //   const errorEl = document.getElementById('errorMsg')
    //
    //   async function askWritePermission() {
    //     try {
    //       const { state } = await navigator.permissions.query({ name: 'clipboard-write', allowWithoutGesture: false })
    //       return state === 'granted'
    //     } catch (error) {
    //       errorEl.textContent = `Compatibility error (ONLY CHROME > V66): ${error.message}`
    //       console.log(error)
    //       return false
    //     }
    //   }
    //
    //   const canWrite = await askWritePermission()
    //
    //   canWriteEl.textContent = canWrite
    //   canWriteEl.style.color = canWrite ? 'green' : 'red'
    //
    //   copyImgBtn.disabled = copyTextBtn.disabled = !canWrite
    //
    //   const setToClipboard = blob => {
    //     const data = [new ClipboardItem({ [blob.type]: blob })]
    //     return navigator.clipboard.write(data)
    //   }
    //
    //   /**
    //    * @param Blob - The ClipboardItem takes an object with the MIME type as key, and the actual blob as the value.
    //    */
    //
    //   copyTextBtn.addEventListener('click', async () => {
    //     try {
    //       const blob = new Blob([textarea.value], { type: 'text/plain' })
    //       await setToClipboard(blob)
    //     } catch (error) {
    //       console.error('Something wrong happened')
    //     }
    //   })
    //
    //   copyImgBtn.addEventListener('click', async () => {
    //     try {
    //       const response = await fetch(img.src)
    //       const blob = await response.blob()
    //       await setToClipboard(blob)
    //     } catch (error) {
    //       console.error('Something wrong happened')
    //       console.error(error)
    //     }
    //   })
    // })

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
