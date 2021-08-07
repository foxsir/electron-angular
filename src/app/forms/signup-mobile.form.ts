import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import {SignupModel} from '@app/models/signup.model';
import {Injectable} from '@angular/core';
import SignupFields from "@app/forms/SignupFields";

@Injectable({
  providedIn: 'root'
})
export class SignupMobileForm {
  form = new FormGroup({});
  model: SignupModel = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    // {
    //   key: 'username',
    //   type: 'input',
    //   templateOptions: {
    //     label: '用户名',
    //     type: 'text',
    //     description: "用户名只能是 (小写字母,数字,-,_) 组成，3-20位",
    //     required: true,
    //   },
    //   validators: {
    //     pattern: {
    //       expression: (c) => !c.value || /^[a-z0-9\\._-]{3,20}$/.test(c.value),
    //       message: (error, field: FormlyFieldConfig) => `${field.templateOptions.description}`,
    //     },
    //   },
    // },
    {
      key: 'user_phone',
      type: 'send-sms',
      templateOptions: {
        label: '请输入手机号',
        type: 'text',
        // description: '只支持大陆地区手机号',
        maxLength: 11,
        minLength: 11,
        required: true,
      },
      validators: {
        pattern: {
          expression: (c) => !c.value || /(1)[0-9]{10}/.test(c.value),
          message: (error, field: FormlyFieldConfig) => `"${field.formControl.value}" 格式不正确`,
        },
      },
    },
    {
      key: 'code',
      type: 'sms-code',
      templateOptions: {
        label: '获取验证码',
        type: 'number',
        // description: '10分钟内有效',
        required: true,
      },
    },
    SignupFields.getField(this, 'user_psw'),
    SignupFields.getField(this, 'confirm_password'),
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
  };

}
