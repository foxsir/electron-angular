import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InputAreaService {

  public enableStatus = true;

  private inputSource = new Subject<boolean>();
  public inputUpdate$ = this.inputSource.asObservable();

  private interval: any;

  constructor() { }

  /**
   * 禁用表单
   */
  disable() {
    this.enableStatus = false;
    this.inputSource.next(this.enableStatus);
  }

  /**
   * 禁用到指定时间后解禁
   * 禁用30秒
   * this.inputAreaService.disableToTime(new Date().getTime() / 1000 + 30);
   * @param timestamp
   */
  disableToTime(timestamp: number) {
    if((timestamp).toFixed(0).toString().length > 10) {
      timestamp = new Date(timestamp).getTime() / 1000;
    }
    if(this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      const now = new Date().getTime() / 1000;
      if(now >= timestamp) {
        this.enable();
        clearInterval(this.interval);
      }
    }, 1000);
    this.enableStatus = false;
    this.inputSource.next(this.enableStatus);
  }

  /**
   * 启用表单
   */
  enable() {
    this.enableStatus = true;
    this.inputSource.next(this.enableStatus);
  }
}
