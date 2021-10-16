import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class InputAreaService {

  public enable = true;

  private inputSource = new Subject<boolean>();
  public inputUpdate$ = this.inputSource.asObservable();

  constructor() { }

  disableInput() {
    this.enable = false;
    this.inputSource.next(this.enable);
  }

  enableInput() {
    this.enable = true;
    this.inputSource.next(this.enable);
  }
}
