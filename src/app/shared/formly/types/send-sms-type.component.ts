import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {FieldType} from '@ngx-formly/material/form-field';
import {HttpService} from '@services/http/http.service';
import {MatButton} from '@angular/material/button';
import {SnackBarService} from '@services/snack-bar/snack-bar.service';
import {APP_CONFIG as environment} from "environments/environment";
import {FormControl} from "@angular/forms";
import Area from "./data/Area";

@Component({
  selector: 'app-formly-field-send-sms-input',
  styles: [`
    ::ng-deep .mat-select-arrow {
        width: 0;
        height: 15px !important;
        border-left: none !important;
        border-right: 1px solid #383838 !important;
        border-top: none !important;
        margin: 0 6px !important;
    }
  `],
  template: `
    <mat-form-field
      [hideRequiredMarker]="true"
      [floatLabel]="to.floatLabel"
      [appearance]="to.appearance"
      [color]="to.color"
      [style.width]="'100%'">
      <mat-label>{{to.label}}</mat-label>
      <section matPrefix>
        <button mat-button type="button" [matMenuTriggerFor]="menu" #areaButton>{{defaultArea}}</button>
        <mat-menu #menu="matMenu">
          <div fxLayout="row" mat-menu-item *ngFor="let area of areaList" (click)="areaChange(areaButton, area.tel)">
            <span>{{area.name}}</span> <span style="flex: 1 1 auto"></span> <span>{{area.tel}}</span>
          </div>
        </mat-menu>
      </section>
      <input
        #input
        matInput
        type="text"
        [id]="id"
        [errorStateMatcher]="errorStateMatcher"
        [formControl]="formControl"
        [formlyAttributes]="field"
        [tabindex]="to.tabindex || 0"
        [placeholder]="to.placeholder"
      >
      <mat-error [id]="null">
        <formly-validation-message [field]="field"></formly-validation-message>
      </mat-error>
      <mat-hint *ngIf="to.description" [id]="null">{{ to.description }}</mat-hint>
    </mat-form-field>
  `,
})
export class SendSmsTypeComponent extends FieldType implements OnInit, AfterViewChecked {
  formControl: FormControl;
  private text = "发送验证码";
  private sendText = "秒后可重新发送";
  private seconds = environment.smsSpaceSeconds;
  private counter = this.seconds;
  public areaList = Area;
  public defaultArea = "+86";

  constructor(
    private http: HttpService,
    private snackBar: SnackBarService
  ) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.model.area = this.defaultArea;
  }

  // send(button: MatButton) {
  //   if (this.formControl.value.length > 0) {
  //     // alert(this.formControl.value);
  //     button.disabled = true;
  //     this.http.post("/sms-log/get", {mobile: this.formControl.value}).subscribe(res => {
  //       if (res.data) {
  //         if (res.data.seconds) {
  //           this.counter = res.data.seconds;
  //         } else {
  //           this.snackBar.openSnackBar(res.data.Message, 'mat-warn');
  //         }
  //         const si = setInterval(() => {
  //           if (this.counter === 0) {
  //             button._elementRef.nativeElement.querySelector(".text").innerText = this.text;
  //             button.disabled = false;
  //             clearInterval(si);
  //           } else {
  //             this.counter --;
  //             button._elementRef.nativeElement.querySelector(".text").innerText = [this.counter, this.sendText].join(" ");
  //           }
  //         }, 1000);
  //       } else {
  //         this.snackBar.openSnackBar("短信发送失败", 'mat-warn');
  //         button.disabled = false;
  //       }
  //     });
  //   }
  // }

  areaChange(areaButton: MatButton, value: string) {
    areaButton._elementRef.nativeElement.textContent = this.model.area = value;
  }

}
