import { Injectable } from '@angular/core';
import ChatMsgEntity from "@app/models/ChatMsgEntity";
import {MsgType} from "@app/config/rbchat-config";

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  public msgType = MsgType;

  private contextMenu: any[] = [];

  constructor() {
    this.contextMenu[this.msgType.TYPE_TEXT] = [
      {
        label: "复制",
        action: (chat: ChatMsgEntity, messageContainer) => {
          this.copyDivToClipboard(messageContainer);
          chat.msgType = this.msgType.TYPE_BACK;
        }
      },
      {
        label: "撤回",
        action: (chat: ChatMsgEntity) => { chat.msgType = this.msgType.TYPE_BACK; }
      },
    ];


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
    //         console.log(base64data);
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






    this.contextMenu[this.msgType.TYPE_IMAGE] = [
      {
        label: "复制",
        action: (chat: ChatMsgEntity, messageContainer) => {
          console.dir(messageContainer.querySelector("img").src);
          this.copyDivToClipboard(messageContainer.querySelector("img"));
          chat.msgType = this.msgType.TYPE_BACK;
        }
      },
      {
        label: "撤回",
        action: (chat: ChatMsgEntity) => { chat.msgType = this.msgType.TYPE_BACK; }
      },
    ];
  }

  copyDivToClipboard(messageContainer) {
    const range = document.createRange();
    range.selectNode(messageContainer);
    window.getSelection().removeAllRanges(); // clear current selection
    window.getSelection().addRange(range); // to select text
    document.execCommand("copy");
    window.getSelection().removeAllRanges();// to deselect
  }

  getContextMenuForChat(chat: ChatMsgEntity) {
    // chat.msgType
    return this.contextMenu[chat.msgType] || [];
  }

  getContextMenuForAvatar(chat: ChatMsgEntity) {

  }

}
