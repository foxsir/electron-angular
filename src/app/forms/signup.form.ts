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
        // description: "用户名只能是 (小写字母,数字,-,_) 组成，3-20位",
        required: true,
      },
      validators: {
        pattern: {
          expression: (c) => !c.value || /^[a-z0-9\\._-]{3,20}$/.test(c.value),
          message: (error, field: FormlyFieldConfig) => `${field.templateOptions.description}`,
        },
      },
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
        required: true,
      },
      validators: {
        // pattern: {
        //   expression: (c) => !c.value || /(\d{1,3}\.){3}\d{1,3}/.test(c.value),
        //   message: (error, field: FormlyFieldConfig) => `"$\{field.formControl.value\}" is not a valid IP Address`,
        // },
      },
    },
    {
      key: 'confirm_password',
      type: 'input',
      templateOptions: {
        label: '请再次输入密码进行确认备份',
        type: 'password',
        required: true,
      },
      validators: {
        // pattern: {
        //   expression: (c) => !c.value || /(\d{1,3}\.){3}\d{1,3}/.test(c.value),
        //   message: (error, field: FormlyFieldConfig) => `"$\{field.formControl.value\}" is not a valid IP Address`,
        // },
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
