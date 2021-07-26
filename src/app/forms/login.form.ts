import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import {LoginModel} from '@app/models/login.model';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginForm {
  form = new FormGroup({});
  model: LoginModel = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'account',
      type: 'input',
      templateOptions: {
        label: '账号',
        type: 'text',
        description: '用户名或者手机号',
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
      key: 'password',
      type: 'input',
      templateOptions: {
        label: '密码',
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
