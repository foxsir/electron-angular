import {MatSnackBar} from '@angular/material/snack-bar';
import {Injectable} from '@angular/core';
import {SnackComponent} from '@services/snack-bar/snack.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  private durationInSeconds = 3;

  constructor(
    private snackBar: MatSnackBar
  ) {
  }

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

}
