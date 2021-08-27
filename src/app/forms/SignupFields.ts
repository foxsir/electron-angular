import {FormlyFieldConfig} from "@ngx-formly/core";
import {SignupForm} from "./signup.form";
import {SignupMobileForm} from "./signup-mobile.form";
import RegexpMap from "@app/forms/RegexpMap";

class SignupFields {
  public static getField(form: SignupForm | SignupMobileForm, name: string) {
    const fields = {
      user_mail: {
        key: 'user_mail',
        type: 'input',
        templateOptions: {
          label: '请输入6-20字母或者数字组合的账号备份',
          type: 'text',
          description: "用户名只能是 (字母,数字) 组成，6-20位",
          required: true,
          minLength: 6,
          maxLength: 20,
          blur:  (field: FormlyFieldConfig, event?: any) => {
            if(!field.formControl.value || field.formControl.value.trim().length === 0) {
              field.formControl.markAsUntouched();
            }
          },
          keyup: (field: FormlyFieldConfig, event?: any) => {
            if (RegexpMap.username.test(field.formControl.value) === false) {
              const regexp = /[a-z0-9]/g;
              const array = [...field.formControl.value.matchAll(regexp)];
              const newValue = array.map(v => v[0]).join("");
              if(newValue.length !== field.formControl.value.length) {
                // field.formControl.setValue(newValue);
                document.execCommand("undo");
              }
            }
          }
        },
        validators: {
          pattern: {
            expression: (c) => !c.value || RegexpMap.username.test(c.value),
            message: (error, field: FormlyFieldConfig) => `${field.templateOptions.description}`,
          },
        }
      },
      user_psw: {
        key: 'user_psw',
        type: 'password',
        templateOptions: {
          label: '请设置最低6位密码备份',
          type: 'password',
          description: '请设置最低6位密码备份',
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
        },
        validators: {
          pattern: {
            expression: (c) => !c.value || c.value.length >= 6,
            message: (error, field: FormlyFieldConfig) => `${field.templateOptions.description}`,
          },
        },
      },
      confirm_password: {
        key: 'confirm_password',
        type: 'password',
        templateOptions: {
          label: '请再次输入密码进行确认备份',
          type: 'password',
          description: '请再次输入密码进行确认备份',
          required: true,
          minLength: 6,
          maxLength: 20,
          blur: (field: FormlyFieldConfig, event?: any) => {
            if(!field.formControl.value || field.formControl.value.trim().length === 0) {
              field.formControl.markAsUntouched();
            } else {
              field.form.controls.user_psw.markAsTouched();
            }
          },
        },
        validators: {
          pattern: {
            expression: (c) => form.model.user_psw === c.value,
            message: (error, field: FormlyFieldConfig) => "两次输入密码不一致",
          },
        },
      }
    };
    return fields[name];
  }
}

export default SignupFields;
