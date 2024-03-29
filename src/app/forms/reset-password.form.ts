import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import {SignupModel} from '@app/models/signup.model';
import {Injectable} from '@angular/core';
import SignupFields from "@app/forms/SignupFields";
import RegexpMap from "@app/forms/RegexpMap";

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordForm {
  form = new FormGroup({});
  model: {
    old_psw?: string;
    user_psw?: string;
    confirm_password?: string;
  } = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'old_psw',
      type: 'password',
      templateOptions: {
        label: '请输入原密码',
        type: 'password',
        description: '请输入原密码',
        required: true,
        minLength: 6,
        maxLength: 20,
        blur: (field: FormlyFieldConfig, event?: any) => {
          if(!field.formControl.value || field.formControl.value.trim().length === 0) {
            field.formControl.markAsUntouched();
          } else {
            if(field.formControl.value && field.formControl.value.toString().length > 0) {
              field.form.controls.confirm_password.markAsTouched();
              field.form.controls.confirm_password.updateValueAndValidity();
            }
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
        pattern: {
          expression: (c) => !c.value || c.value.length >= 6,
          message: (error, field: FormlyFieldConfig) => `${field.templateOptions.description}`,
        },
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
