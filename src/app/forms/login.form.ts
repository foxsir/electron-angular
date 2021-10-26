import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import {LoginModel} from '@app/models/login.model';
import {Injectable} from '@angular/core';
import RegexpMap from "@app/forms/RegexpMap";

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
        label: '请输入登录账号',
        type: 'text',
        // description: '用户名或者手机号',
        required: true,
        maxLength: 20,
        minLength: 6,
        blur:  (field: FormlyFieldConfig, event?: any) => {
          if(!field.formControl.value || field.formControl.value.trim().length === 0) {
            field.formControl.markAsUntouched();
          }
        },
        keyup: (field: FormlyFieldConfig, event?: any) => {
          if (field.formControl.value && RegexpMap.username.test(field.formControl.value) === false) {
            const regexp = /[a-z0-9]/g;
            const array = [...field.formControl.value.matchAll(regexp)];
            const newValue = array.map(v => v[0]).join("");
            if(newValue.length !== field.formControl.value.length) {
              field.formControl.reset(newValue);
              document.execCommand("undo");
            }
          }
        }
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
      type: 'password',
      templateOptions: {
        label: '密码',
        type: 'password',
        required: true,
        maxLength: 20,
        minLength: 6,
        blur:  (field: FormlyFieldConfig, event?: any) => {
          if(!field.formControl.value || field.formControl.value.trim().length === 0) {
            field.formControl.markAsUntouched();
          }
        },
        keyup: (field: FormlyFieldConfig, event?: any) => {
          if (field.formControl.value.length > field.formControl.value.trim().length ) {
            field.formControl.reset(field.formControl.value.trim());
            document.execCommand("undo");
          }
        }
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
