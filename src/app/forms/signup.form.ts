import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import {SignupModel} from '@app/models/signup.model';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignupForm {
  form = new FormGroup({});
  model: SignupModel = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'user_mail',
      type: 'input',
      templateOptions: {
        label: '请输入6-20字母或者数字组合的账号备份',
        type: 'text',
        description: "用户名只能是 (小写字母,数字,-,_) 组成，6-20位",
        required: true,
        minLength: 6,
        maxLength: 20,
        keyup: (field: FormlyFieldConfig, event?: any) => {
          if (/^[0-9a-zA-Z]*$/g.test(field.form.value.user_mail) === false) {
            const charts = [
              ...["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
              ...["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
              ...["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
            ];

            const regexp = /[a-z0-9]/g;

            const array = [...field.form.value.user_mail.matchAll(regexp)];
            const newValue = array.map(v => {
              return v[0];
            });
            field.formControl.setValue(newValue.join(""));
          }
        }
      },
      validators: {
        pattern: {
          expression: (c) => !c.value || /^[0-9a-zA-Z]{6,20}[0-9]+[a-zA-Z]+$/g.test(c.value),
          message: (error, field: FormlyFieldConfig) => `${field.templateOptions.description}`,
        },
      }
    },
    // {
    //   key: 'mobile',
    //   type: 'send-sms',
    //   templateOptions: {
    //     label: '手机号',
    //     type: 'text',
    //     description: '只支持大陆地区手机号',
    //     maxLength: 11,
    //     minLength: 11,
    //     required: true,
    //   },
    //   validators: {
    //     // pattern: {
    //     //   expression: (c) => !c.value || /(\d{1,3}\.){3}\d{1,3}/.test(c.value),
    //     //   message: (error, field: FormlyFieldConfig) => `"$\{field.formControl.value\}" is not a valid IP Address`,
    //     // },
    //   },
    // },
    // {
    //   key: 'code',
    //   type: 'input',
    //   templateOptions: {
    //     label: '验证码',
    //     type: 'number',
    //     description: '10分钟内有效',
    //     required: true,
    //   },
    // },
    {
      key: 'user_psw',
      type: 'password',
      templateOptions: {
        label: '请设置最低6位密码备份',
        type: 'password',
        description: '请设置最低6位密码备份',
        required: true,
        maxLength: 20,
        minLength: 6,
        blur: (field: FormlyFieldConfig, event?: any) => {
          if(field.formControl.value && field.formControl.value.toString().length > 0) {
            this.form.controls.confirm_password.markAsTouched();
            this.form.controls.confirm_password.updateValueAndValidity();
          }
        },
      },
      validators: {
        pattern: {
          expression: (c) => !c.value || c.value.length >= 6,
          message: (error, field: FormlyFieldConfig) => `${field.templateOptions.description}`,
        },
      },
    },
    {
      key: 'confirm_password',
      type: 'password',
      templateOptions: {
        label: '请再次输入密码进行确认备份',
        type: 'password',
        description: '请再次输入密码进行确认备份',
        required: true,
        maxLength: 20,
        minLength: 6,
        blur: (field: FormlyFieldConfig, event?: any) => {
          this.form.controls.user_psw.markAsTouched();
        },
      },
      validators: {
        pattern: {
          expression: (c) => this.model.user_psw === c.value,
          message: (error, field: FormlyFieldConfig) => "两次输入密码不一致",
        },
      },
    },
    // {
    //   key: 'email',
    //   type: 'input',
    //   templateOptions: {
    //     label: '邮箱地址',
    //     type: 'text',
    //     required: false,
    //   },
    //   validators: {
    //     // pattern: {
    //     //   expression: (c) => !c.value || /(\d{1,3}\.){3}\d{1,3}/.test(c.value),
    //     //   message: (error, field: FormlyFieldConfig) => `"$\{field.formControl.value\}" is not a valid IP Address`,
    //     // },
    //   },
    // },
  ];

  getFields = (columns: string[]) => {
    const selectFields: FormlyFieldConfig[] = [];
    columns.forEach(item => {
      this.fields.forEach(field => {
        if( field.key === item ) {
          selectFields.push(field);
        }
      });
    });
    return selectFields;
  }

}
