import {Component, OnInit} from '@angular/core';
import {FieldType} from '@ngx-formly/material/form-field';
import {HttpService} from '@services/http/http.service';
import {MatButton} from '@angular/material/button';
import {SnackBarService} from '@services/snack-bar/snack-bar.service';
import {APP_CONFIG as environment} from "environments/environment";
import {FormControl} from "@angular/forms";
import {getVerifyCode} from "@app/config/post-api";
import NewHttpResponseInterface from "@app/interfaces/new-http-response.interface";
import {RestService} from "@services/rest/rest.service";
import {IndexComponent} from "@modules/session/index/index.component";


@Component({
  selector: 'app-formly-field-sms-code-input',
  template: `
    <mat-form-field
      [hideRequiredMarker]="true"
      [floatLabel]="to.floatLabel"
      [appearance]="to.appearance"
      [color]="to.color"
      [style.width]="'100%'">
      <mat-label>{{to.label}}</mat-label>
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
      <section matSuffix>
        <button mat-button type="button" color="primary" #button (click)="send(button)">
          <span class="text">{{sendText}}</span>
        </button>
      </section>
      <!-- fix https://github.com/angular/material2/issues/7737 by setting id to null  -->
      <mat-error [id]="null">
        <formly-validation-message [field]="field"></formly-validation-message>
      </mat-error>
      <!-- fix https://github.com/angular/material2/issues/7737 by setting id to null  -->
      <mat-hint *ngIf="to.description" [id]="null">{{ to.description }}</mat-hint>
    </mat-form-field>
  `,
})
export class SmsCodeTypeComponent extends FieldType implements OnInit {
  formControl: FormControl;
  public sendText = "发送验证码";
  private resendText = "秒后可重新发送";
  private seconds = environment.smsSpaceSeconds;
  private counter = this.seconds;

  constructor(
    private http: HttpService,
    private snackBar: SnackBarService,
    private restService: RestService,
    private snackBarService: SnackBarService
  ) {
    super();
  }

  ngOnInit() {
  }

  send(button: MatButton) {
    const mobile = this.field.form.value.user_phone;
    const areaCode = this.model.area;
    // 发送验证码前,先验证手机号是否存在
    const data = {
      phone: [this.model.area, this.form.value.user_phone].join("-"),
      username: this.form.value.user_mail ? this.form.value.user_mail : '',
    };
    if (mobile && mobile.length > 0) {
      this.restService.checkUsernameAndPhone(data).subscribe((res: NewHttpResponseInterface<any>) => {
        if (res.status !== 200) {
          return this.snackBarService.openMessage(res.msg);
        } else {
          // alert(this.formControl.value);
          button.disabled = true;
          this.http.postForm(getVerifyCode, {phone: [areaCode, mobile].join("-")}).subscribe((res: NewHttpResponseInterface<any>) => {
            if (Number(res.status) === 200) {
              // if (res.data.seconds) {
              //   this.counter = res.data.seconds;
              // } else {
              //   this.snackBar.openMessage(res.data.Message, 'mat-warn');
              // }
              const si = setInterval(() => {
                if (this.counter === 0) {
                  this.sendText = "重新获取";
                  button.disabled = false;
                  clearInterval(si);
                } else {
                  this.counter--;
                  this.sendText = [this.counter, this.resendText].join("");
                }
              }, 1000);
            } else {
              this.snackBar.openMessage(res.msg);
              button._elementRef.nativeElement.textContent = "重新获取";
              button.disabled = false;
            }
          });

        }
      });
    } else {
      this.form.controls.user_phone.markAsTouched();
    }


  }

}
