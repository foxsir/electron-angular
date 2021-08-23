import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoDialogComponent } from './demo-dialog/demo-dialog.component';
import { NzSwitchModule } from "ng-zorro-antd/switch";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    DemoDialogComponent
  ],
  imports: [
      CommonModule,
      NzSwitchModule,
      NzSelectModule,
      NzInputModule,
      NzButtonModule,
      NzListModule,
      NzRadioModule,
      MatDialogModule,
      MatButtonModule,
      MatCardModule,
      MatIconModule,
      MatRadioModule,
      FlexLayoutModule,
      FormsModule,
  ]
})
export class SettingDialogsModule { }
