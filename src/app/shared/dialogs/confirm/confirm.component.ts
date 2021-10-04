import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {

  image: SafeResourceUrl = null;

  constructor(
    public dialogRef: MatDialogRef<ConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {title: string; text: string; confirm: string; cancel: string },
    private dom: DomSanitizer
  ) { }

  ngOnInit(): void {
    if(this.data.text) {
      if(this.data.text.includes('blob') === true || this.data.text.includes('http') === true) {
        this.image = this.dom.bypassSecurityTrustResourceUrl(this.data.text);
      }
    }
  }

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

}
