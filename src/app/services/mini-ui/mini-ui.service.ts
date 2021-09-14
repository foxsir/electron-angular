import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MiniUiService {
  private messageDrawerSource = new Subject<boolean>();
  messageDrawer$ = this.messageDrawerSource.asObservable();

  private addressListDrawerSource = new Subject<boolean>();
  addressListDrawer$ = this.addressListDrawerSource.asObservable();

  private miniSource = new Subject<boolean>();
  mini$ = this.miniSource.asObservable();

  public isMini: boolean = false;

  constructor() { }

  switchMessage() {
    this.messageDrawerSource.next(true);
    this.addressListDrawerSource.next(false);
  }

  switchAddressList() {
    this.messageDrawerSource.next(false);
    this.addressListDrawerSource.next(true);
  }

  switchMiniUI(mini: boolean) {
    this.isMini = mini;
    this.miniSource.next(mini);
  }


}
