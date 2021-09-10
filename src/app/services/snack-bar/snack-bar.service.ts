import {MatSnackBar} from '@angular/material/snack-bar';
import {Injectable} from '@angular/core';
import {SnackComponent} from '@services/snack-bar/snack.component';
import {NzMessageService} from "ng-zorro-antd/message";
import {NzConfigService} from "ng-zorro-antd/core/config";
import {OverlayContainer} from "@angular/cdk/overlay";

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
    private overlayContainer: OverlayContainer,
  ) {
  }

  /**
   * 垂直剧中消息提示
   * @param messageText
   * @param color
   */
  public openMessage(messageText: string, color = "mat-default"): void {
    const parentElement = this.overlayContainer.getContainerElement().parentElement;
    parentElement.classList.add("center-snack-bar");
    const snackBar = this.snackBar.openFromComponent(SnackComponent, {
      data: {text: messageText, color},
      verticalPosition: 'top',
      horizontalPosition: 'center',
      duration: this.durationInSeconds * 1000
    });
    snackBar.afterDismissed().subscribe((s) => {
      if(this.snackBar._openedSnackBarRef === null) {
        parentElement.classList.remove("center-snack-bar");
      }
    });
  }

}
