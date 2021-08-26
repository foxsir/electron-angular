import { Injectable } from '@angular/core';
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ElementService {

  // 选择消息
  private selectMessageSource = new Subject<boolean>();
  selectMessage$ = this.selectMessageSource.asObservable();

  constructor() { }

  selectMessage(directive: boolean) {
    this.selectMessageSource.next(directive);
  }

  copyTextToClipboard(container: HTMLDivElement) {
    try {
      const blob = new Blob([container.innerText], { type: 'text/plain' });
      return this.setToClipboard(blob);
    } catch (error) {
      console.error('Something wrong happened');
    }
  }

  copyImageToClipboard(img: HTMLImageElement) {
    // take any image
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

  private setToClipboard(blob) {
    const data = [new ClipboardItem({ [blob.type]: blob })];
    return navigator.clipboard.write(data);
  }

}
