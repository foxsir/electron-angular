import { Component, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';

@Component({
  selector: 'snack-bar-component',
  template: `
    <div fxLayout="row" style="flex: 1 1 100%; display: flex;">
      <button [class]="'mat-button ' + data.color">
        <span class="mat-button-wrapper">{{data.text}}</span>
      </button>
      <span style="flex: 1 1 auto"></span>
      <button class="mat-button" (click)="snackBarRef.dismiss()">
        <span class="mat-button-wrapper">OK</span>
      </button>
    </div>`,
  styles: [
    `.mat-button {
        box-sizing: border-box;
        position: relative;
        user-select: none;
        cursor: pointer;
        outline: none;
        border: none;
        display: inline-block;
        white-space: initial;
        text-decoration: none;
        vertical-align: baseline;
        text-align: center;
        margin: 0;
        min-width: 64px;
        line-height: unset;
        padding: 0 16px;
        border-radius: 4px;
        overflow: visible;
    }`
  ]
})
export class SnackComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<SnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }
}
