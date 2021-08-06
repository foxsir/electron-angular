import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  AfterContentChecked
} from '@angular/core';
import { FieldType } from '@ngx-formly/material/form-field';
import {FormControl} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {FormlyWrapperFormField} from "@ngx-formly/material/form-field/form-field.wrapper";

interface MatFormlyFieldConfig extends FormlyFieldConfig {
  _matprefix?: TemplateRef<any>;
  _matsuffix?: TemplateRef<any>;
  _formField?: FormlyWrapperFormField;
}

@Component({
  selector: 'formly-field-mat-password',
  template: `
      <input
        #input
        matInput
        [id]="id"
        [type]="'password'"
        [readonly]="to.readonly"
        [required]="to.required"
        [errorStateMatcher]="errorStateMatcher"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [tabIndex]="to.tabindex"
        [placeholder]="to.placeholder"
      />
      <ng-template #buttonToggle>
        <a type="button" style="cursor: pointer" matSuffix aria-label="Clear" (click)="switchInputType(input)">
          <mat-icon>
            <img [src]="visibilityIcon" *ngIf="visibilityPassword" alt="">
            <img [src]="hiddenIcon" *ngIf="!visibilityPassword" alt="">
          </mat-icon>
        </a>
      </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyFieldPassword extends FieldType implements AfterContentChecked {
  @ViewChild('buttonToggle', { static: true }) buttonToggle!: TemplateRef<any>;

  formControl: FormControl;
  field!: MatFormlyFieldConfig;

  visibilityPassword = false;
  inputType = "password";

  private togglePosition: string = 'suffix';

  constructor(
    private dom: DomSanitizer
  ) {
    super();
  }

  ngAfterContentChecked() {
    setTimeout(() => {
      this.to[this.togglePosition] = this.buttonToggle;
    });
  }

  visibilityIcon = this.dom.bypassSecurityTrustResourceUrl(
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMjAgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYwLjEgKDg4MTMzKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT7nvJbnu4TlpIfku70gMjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IjTnmbvlvZUt6L6T5YWl5a+G56CB55qE54q25oCBLeecvOedm+aJk+W8gOeKtuaAgSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM2MC4wMDAwMDAsIC0xNjkuMDAwMDAwKSIgZmlsbD0iI0NDQ0NDQyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hOWkh+S7vS0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjAuMDAwMDAwLCAxNjkuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTkuNjc3NDAxLDYuMzUwNTI3NTIgQzE4LjY0NjE3MzcsNC42MTU0ODQ3OCAxNS41NjcwMTYyLDAuMDA4NjQ3MTcxNzIgOS45MzE1NzY4LDAuMDA4NjQ3MTcxNzIgQzUuNzM1OTY2MzEsMC4xMTk5ODA3MzYgMS45NDk5NjA1NSwyLjYyODg2MTE2IDAuMTEzMTMwODk4LDYuNTE1MDU3NDQgQy0wLjAzMjE0OTkwODQsNi44MTY2MDg2NCAtMC4wMzIxNDk5MDg0LDcuMTcwNzcxMTYgMC4xMTMxMzA4OTgsNy40NzIzMjIzNyBDMS44Njg0OTczMiwxMS4zOTk2MTk0IDUuNjY2NDU3MDcsMTMuOTMxNTczOSA5Ljg2NDQ3OTI1LDEzLjk3MzE3MzUgQzE0LjA2MjUwMTQsMTQuMDE0NzczMSAxNy45MDcwNzA2LDExLjU1ODU1MDggMTkuNzM1NDk4NCw3LjY2Njc2NjgzIEMxOS45MzQ2MTk3LDcuMjQ2MzY2OTcgMTkuOTEyNzM2Nyw2Ljc1MDU5MDY4IDE5LjY3NzQwMSw2LjM1MDUyNzUyIEwxOS42Nzc0MDEsNi4zNTA1Mjc1MiBaIE05LjkzMTU3NjgsMTIuMTgzODYwOCBDNy4xNDgwOTM3NSwxMi4xODM4NjA4IDQuODkxNjM0OTEsOS44NjAxNDIxNiA0Ljg5MTYzNDkxLDYuOTkzNjg5OSBDNC44OTE2MzQ5MSw0LjEyNzIzNzY1IDcuMTQ4MDkzNzUsMS44MDM1MTg5OCA5LjkzMTU3NjgsMS44MDM1MTg5OCBDMTIuNzE1MDU5OCwxLjgwMzUxODk4IDE0Ljk3MTUxODcsNC4xMjcyMzc2NSAxNC45NzE1MTg3LDYuOTkzNjg5OSBDMTQuOTYzNTQxMSw5Ljg1NjczMjMzIDEyLjcxMTc0ODcsMTIuMTc1NjQ1NSA5LjkzMTU3NjgsMTIuMTgzODYwOCBMOS45MzE1NzY4LDEyLjE4Mzg2MDggWiIgaWQ9IuW9oueKtiI+PC9wYXRoPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTcuMjE1NTI3NDIsNi45OTM2ODk5IEM3LjIxNTUyNzQyLDguNTM4NDM1MDcgOC40MzE1NDQxNSw5Ljc5MDY5ODQ1IDkuOTMxNTc2OCw5Ljc5MDY5ODQ1IEMxMS40MzE2MDk0LDkuNzkwNjk4NDUgMTIuNjQ3NjI2Miw4LjUzODQzNTA3IDEyLjY0NzYyNjIsNi45OTM2ODk5IEMxMi42NDc2MjYyLDUuNDQ4OTQ0NzQgMTEuNDMxNjA5NCw0LjE5NjY4MTM2IDkuOTMxNTc2OCw0LjE5NjY4MTM2IEM4LjQzMTU0NDE1LDQuMTk2NjgxMzYgNy4yMTU1Mjc0Miw1LjQ0ODk0NDc0IDcuMjE1NTI3NDIsNi45OTM2ODk5IEw3LjIxNTUyNzQyLDYuOTkzNjg5OSBaIiBpZD0i6Lev5b6EIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg=="
  );
  hiddenIcon = this.dom.bypassSecurityTrustResourceUrl(
    "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMjAgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDYwLjEgKDg4MTMzKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT7nvJbnu4TlpIfku70gMjwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxnIGlkPSLpobXpnaItMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IjPnmbvlvZUt6L6T5YWl5a+G56CB55qE54q25oCBLeecvOedm+m7mOiupOWFs+mXrSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTM2MC4wMDAwMDAsIC0xNjkuMDAwMDAwKSIgZmlsbD0iI0NDQ0NDQyIgZmlsbC1ydWxlPSJub256ZXJvIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hOWkh+S7vS0yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzNjAuMDAwMDAwLCAxNjkuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTMuODI3MDUxMyw2LjQyNjc5OTAxIEwxNy40MTQyMzA4LDQuMDg4ODMzNzUgQzE3LjU0NTUxMjgsNC4wMDM3MjIwOCAxNy42NjUsMy45MDM1NTY2NiAxNy43NzIxNzk1LDMuNzkzNTQ4MzkgQzE4LjQ4MjkxOTgsNC41NDg2NTkyNiAxOS4xNDM4MjU4LDUuMzYxNDExNyAxOS43NDk2MTU0LDYuMjI1MzEwMTcgQzIwLjA0ODUyMjMsNi42NDc5MjQ4OSAyMC4wNDg1MjIzLDcuMjQ3ODU2NzUgMTkuNzQ5NjE1NCw3LjY3MDQ3MTQ2IEMxNi44MTY3OTQ5LDExLjgyMDY3ODMgMTMuNTYxNDEwMywxMy44OTU3ODE2IDkuOTg3MDUxMjksMTMuODk1NzgxNiBDOC4xNzk4NzE4LDEzLjg5NTc4MTYgNi40NTQyMzA3NywxMy4zNjU0MjYgNC44MTA2NDEwMiwxMi4zMDQ3MTQ2IEw3LjMxMjE3OTQ4LDEwLjY3MzY5NzMgQzguNjI0OTQyMTQsMTEuNzY5MDkzNCAxMC4zODc5ODY2LDExLjg4MTU4MDEgMTEuODAxNjk2OSwxMC45NjAxMzk5IEMxMy4yMTU0MDcxLDEwLjAzODY5OTcgMTQuMDEwNzY4OCw4LjI1ODY3Mjk1IDEzLjgyNzA1MTMsNi40MjczNzggTDEzLjgyNzA1MTMsNi40MjY3OTkwMSBaIE0xMS4zNjAzODQ2LDIuNjg2NTE3NzggQzEwLjE3MzA1NSwyLjExNDU3MzgxIDguODE2NTUxNjcsMi4yMDY4NDAyOCA3LjY5ODYyNTg0LDIuOTM1NTgyODEgQzYuNTgwNzAwMDEsMy42NjQzMjUzNSA1LjgzMTcxMDA2LDQuOTQ0NTY3MjIgNS42NzY3OTQ4Nyw2LjM5MTQ4MDU2IEwyLjAzOTM1ODk4LDguNzYyNDQ4MyBDMS44MjYwODc2OCw4LjkwMTE4NjA3IDEuNjM2NzMxMTUsOS4wODIyMjA3OCAxLjQ4MDM4NDYyLDkuMjk2ODU2OTEgQzEuMDQwMjA0MzYsOC43NzYwNjA1NyAwLjYyMDk3Nzk2NCw4LjIzMzE5MTM3IDAuMjIzOTc0MzYzLDcuNjY5ODkyNDcgQy0wLjA3NDY1OTYwNDksNy4yNDczODY1MiAtMC4wNzQ2NTk2MDQ5LDYuNjQ3ODE2MTMgMC4yMjM5NzQzNjMsNi4yMjUzMTAxNyBDMy4xNTc4MjA1MiwyLjA3NTEwMzM5IDYuNDEyMTc5NDgsMCA5Ljk4NzA1MTI5LDAgQzExLjM4MTkyMzEsMCAxMi43Mjg1ODk3LDAuMzE2MTI5MDMyIDE0LjAyNjUzODUsMC45NDgzODcwOTcgTDExLjM2MDM4NDYsMi42ODY1MTc3OCBaIiBpZD0i5b2i54q2Ij48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMS40MDczNDI2MywxMC40MjE4MDY4IEwxNi41MDcyNzI4LDAuNTc4OTYxNDg2IEMxNy4wOTk0MjY5LDAuMTkyOTY3NTQ5IDE3LjU2NjQ0NDEsMC4zMzQyNTExMzUgMTcuOTA4MzI0NCwxLjAwMjgxMjI1IEwxNy45MDgzMjQ0LDEuMDAyODEyMjUgQzE4LjI1MDIwNDgsMS42NzEzNzMzNSAxOC4xMjUwNjc5LDIuMTk4NjUwODcgMTcuNTMyOTEzOCwyLjU4NDY0NDggTDIuNDMyOTgzNjUsMTIuNDI3NDkwMSBDMS44NDA4Mjk1NCwxMi44MTM0ODQxIDEuMzczODEyMywxMi42NzIyMDA1IDEuMDMxOTMxOTYsMTIuMDAzNjM5NCBMMS4wMzE5MzE5NiwxMi4wMDM2Mzk0IEMwLjY5MDA1MTYxNSwxMS4zMzUwNzgzIDAuODE1MTg4NTA2LDEwLjgwNzgwMDcgMS40MDczNDI2MywxMC40MjE4MDY4IFoiIGlkPSLot6/lvoQiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
  );

  switchInputType(input: HTMLInputElement) {
    this.visibilityPassword = !this.visibilityPassword;
    input.type =  this.visibilityPassword ? 'input' : 'password';
  }
}
