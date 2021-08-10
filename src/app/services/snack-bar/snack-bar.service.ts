import {MatSnackBar} from '@angular/material/snack-bar';
import {Injectable} from '@angular/core';
import {SnackComponent} from '@services/snack-bar/snack.component';
import {NzMessageService} from "ng-zorro-antd/message";
import {NzConfigService} from "ng-zorro-antd/core/config";

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  /**
   * 提示持续显示时间，单位s
   * @private
   */
  private durationInSeconds = 3;

  constructor(
    private snackBar: MatSnackBar,
    private message: NzMessageService,
    private readonly nzConfigService: NzConfigService
  ) {
    this.nzConfigService.set("message", {
      nzTop: "calc(50% - 22px)",
      nzDuration: 3000,
      nzAnimate: false,
    });
  }

  /**
   * 显示material放个消息提示
   * @url https://material.angular.io/components/snack-bar/overview
   * @param messageText
   * @param color
   */
  public openSnackBar(messageText: string, color = "mat-accent"): void {
    const snackBar = this.snackBar.openFromComponent(SnackComponent, {
      data: {text: messageText, color},
      verticalPosition: 'top',
      horizontalPosition: 'right',
      duration: this.durationInSeconds * 1000
    });
    snackBar.onAction().subscribe(() => {
      snackBar.dismiss();
    });
  }

  /**
   * antd风格消息提示
   * @url https://ng.ant.design/components/message/en
   * @param message
   * @param type
   */
  public openMessage(message: string, type: string = ''): void {
    this.message.create(type, message, {
      nzDuration: this.durationInSeconds * 1000
    });
  }

}
