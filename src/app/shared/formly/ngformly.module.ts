import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyMaterialModule} from '@ngx-formly/material';

import {SendSmsTypeComponent} from './types/send-sms-type.component';

import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

import {FormlyMatDatepickerModule} from '@ngx-formly/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import {AutochipsTypeComponent} from '@app/shared/formly/types/autochips-type.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';

import {NzUploadModule} from 'ng-zorro-antd/upload';

import {ImageTypeComponent} from '@app/shared/formly/types/image-type.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCardModule} from '@angular/material/card';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatNativeDateModule} from '@angular/material/core';
import {AutocompleteTypeComponent} from '@app/shared/formly/types/autocomplete-type.component';
// import {RichtextTypeComponent} from '@app/shared/formly/types/richtext-type.component';
import {FormlyMatToggleModule} from '@ngx-formly/material/toggle';
import {FormlyFieldSelect} from '@app/shared/formly/types/select';
import {FormlyFieldPassword} from '@app/shared/formly/types/password';
import {SmsCodeTypeComponent} from "@app/shared/formly/types/sms-code-type.component";
import {MatSelectModule} from "@angular/material/select";
import {MatMenuModule} from "@angular/material/menu";

export function minlengthValidationMessage(err, field) {
  return `不能少于 ${field.templateOptions.minLength} 个字符`;
}

export function maxlengthValidationMessage(err, field) {
  return `不能多于 ${field.templateOptions.maxLength} 个字符`;
}

export function minValidationMessage(err, field) {
  return `数值应该大于 ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
  return `数值应该小于 ${field.templateOptions.max}`;
}

@NgModule({
  declarations: [
    /**
     * Components / Directives/ Pipes
     */
    SendSmsTypeComponent,
    SmsCodeTypeComponent,
    AutochipsTypeComponent,
    AutocompleteTypeComponent,
    // RichtextTypeComponent,
    ImageTypeComponent,
  ],
  entryComponents: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyMaterialModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'send-sms',
          component: SendSmsTypeComponent,
        },
        {
          name: 'sms-code',
          component: SmsCodeTypeComponent,
        },
        {
          name: 'autochips',
          component: AutochipsTypeComponent,
        },
        {
          name: 'autocomplete',
          component: AutocompleteTypeComponent,
        },
        // {
        //   name: 'richtext',
        //   component: RichtextTypeComponent,
        // },
        {
          name: 'password',
          component: FormlyFieldPassword,
          wrappers: ['form-field'],
        },
        {
          name: 'select',
          component: FormlyFieldSelect,
        },
        {
          name: 'upload-image',
          component: ImageTypeComponent,
          wrappers: ['form-field'],
          defaultOptions: {
            templateOptions: {
              floatPlaceholder: 'always',
              floatLabel: 'always',
            },
          },
        },
      ],
      validationMessages: [
        {name: 'required', message: '不能留空'},
        {name: 'minlength', message: minlengthValidationMessage},
        {name: 'maxlength', message: maxlengthValidationMessage},
        {name: 'min', message: minValidationMessage},
        {name: 'max', message: maxValidationMessage},
      ],
    }),
    FormlyMatDatepickerModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    NzUploadModule,
    MatProgressSpinnerModule,
    MatCardModule,
    FlexLayoutModule,
    MatNativeDateModule,
    FormlyMatToggleModule,
    MatSelectModule,
    MatMenuModule,
  ],
  exports: [
    FormlyModule,
  ]
})
export class NgformlyModule {
}
