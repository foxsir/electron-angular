import { Injectable } from '@angular/core';
import AlarmItemInterface from "@app/interfaces/alarm-item.interface";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ElementService {

  // 正在播放的语音
  private activatedAudio: HTMLAudioElement;

  // 正在播放的视频
  private activatedVideo: HTMLVideoElement;

  // 选择消息
  private selectMessageSource = new Subject<boolean>();
  selectMessage$ = this.selectMessageSource.asObservable();

  // 选择消息
  private atMemberSource = new Subject<string>();
  atMember$ = this.atMemberSource.asObservable();

  constructor() { }

  /**
   * select message 订阅事件
   * @param directive
   */
  selectMessage(directive: boolean) {
    this.selectMessageSource.next(directive);
  }


  atMember(friendId: string) {
    this.atMemberSource.next(friendId);
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

  /**
   * 同时只能播放一个音频
   * @param tag
   */xiu
  oncePLayAudio(tag: HTMLAudioElement) {
    if(this.activatedAudio && this.activatedAudio !== tag) {
      this.activatedAudio.pause();
    }
    if(this.activatedVideo) {
      this.activatedVideo.pause();
    }
    this.activatedAudio = tag;
  }

  /**
   * 同时只能播放一个视频
   * @param tag
   */
  oncePLayVideo(tag: HTMLVideoElement) {
    if(this.activatedVideo && this.activatedVideo !== tag) {
      this.activatedVideo.pause();
    }
    if(this.activatedAudio) {
      this.activatedAudio.pause();
    }
    this.activatedVideo = tag;
  }

}
