import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-preview-media',
  templateUrl: './preview-media.component.html',
  styleUrls: ['./preview-media.component.scss']
})
export class PreviewMediaComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<PreviewMediaComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: {type: 'image' | 'video'; url: SafeResourceUrl} // 必需
  ) { }

  ngOnInit(): void {

  }

}
