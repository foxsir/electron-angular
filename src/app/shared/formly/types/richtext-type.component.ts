import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import RichEditor from "@app/libs/rich-markdown-editor";

@Component({
  selector: 'formly-richtext-type',
  styleUrls: ["./richtext-type.scss"],
  template: `
    <mat-form-field floatLabel="always" style="width: 100%;">
      <mat-label>{{to.label}} {{field.templateOptions.required ? '*' : ''}}</mat-label>
      <div [id]="[this.field.id, '_editor'].join('')" class="editor"></div>
      <textarea
        matInput
        hidden
        [formControl]="formControl"
        [formlyAttributes]="field"
        [placeholder]="to.placeholder"
        [errorStateMatcher]="errorStateMatcher"
      ></textarea>
      <mat-hint [id]="null">{{ to.description }} <a href="/docs/editor" target="_blank">使用说明</a> </mat-hint>
    </mat-form-field>
  `,
})
export class RichtextTypeComponent extends FieldType implements OnInit, AfterViewInit {
  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    RichEditor(["#", this.field.id, '_editor'].join(""), this.formControl.value || this.field.defaultValue, (value) => {
      this.field.formControl.setValue(value.toString().replaceAll("\\", "").trim());
    });
    // temporary fix for https://github.com/angular/material2/issues/6728
  }
}
