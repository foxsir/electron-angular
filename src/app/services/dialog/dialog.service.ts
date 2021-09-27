import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ComponentType} from "@angular/cdk/portal";
import {MatDialogConfig} from "@angular/material/dialog/dialog-config";
import {ConfirmComponent} from "@app/shared/dialogs/confirm/confirm.component";
import {AlertComponent} from "@app/shared/dialogs/alert/alert.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(
    public dialog: MatDialog
  ) { }

  openDialog(component: ComponentType<any>, config: MatDialogConfig = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(component, config);

      dialogRef.afterClosed().subscribe(result => {
        resolve(result);
      });
    });
  }

    confirm(data: Partial<{ title: string; text: string; confirm: string; cancel: string; width: string; height: string }>): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.openDialog(ConfirmComponent, {
                width: data.width === undefined ? '354px' : data.width + 'px',
                height: data.height ? data.height + 'px' : data.height,
                data: data
            }).then((res: boolean) => {
                resolve(res);
            });
        });
    }

  alert(data: Partial<{title: string; text: string; confirm: string; cancel: string }>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.openDialog(AlertComponent, {
        width: '314px',
        height: '164px',
        data: data
      }).then((res: boolean) => {
        resolve(res);
      });
    });
  }

}
