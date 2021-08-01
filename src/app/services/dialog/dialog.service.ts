import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ComponentType} from "@angular/cdk/portal";
import {MatDialogConfig} from "@angular/material/dialog/dialog-config";

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(
    public dialog: MatDialog
  ) { }


  openDialog(component: ComponentType<any>, config: MatDialogConfig) {
    const dialogRef = this.dialog.open(component, config);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
