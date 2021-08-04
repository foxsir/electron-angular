import { Component, ViewChild } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FieldType } from '@ngx-formly/material/form-field';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'formly-field-mat-select',
  template: `
    <ng-template #selectAll let-selectOptions="selectOptions">
      <mat-option (click)="toggleSelectAll(selectOptions)">
        <mat-pseudo-checkbox class="mat-option-pseudo-checkbox"
          [state]="getSelectAllState(selectOptions)">
        </mat-pseudo-checkbox>
        {{ to.selectAllOption }}
      </mat-option>
    </ng-template>

    <mat-select [id]="id"
      [formControl]="formControl"
      [formlyAttributes]="field"
      [placeholder]="to.placeholder"
      [tabIndex]="to.tabindex"
      [required]="to.required"
      [compareWith]="to.compareWith"
      [multiple]="to.multiple"
      (selectionChange)="change($event)"
      (blur)="selectBlur()"
      (focus)="selectFocus()"
      [errorStateMatcher]="errorStateMatcher"
      [aria-labelledby]="_getAriaLabelledby()"
      [disableOptionCentering]="to.disableOptionCentering"
      >
      <mat-optgroup disabled="true">
        <mat-form-field floatLabel="never" style="width: 100%;">
          <input matInput placeholder="筛选" #filter (input)="filterOptions(filter)">
        </mat-form-field>
      </mat-optgroup>
      <ng-container *ngIf="to.options | formlySelectOptions:field | async as selectOptions">
        <ng-container *ngIf="to.multiple && to.selectAllOption"
                      [ngTemplateOutlet]="selectAll" [ngTemplateOutletContext]="{ selectOptions: selectOptions }">
        </ng-container>
        <ng-container *ngFor="let item of selectOptions">
          <mat-optgroup *ngIf="item.group" [label]="item.label">
            <mat-option *ngFor="let child of item.group" [value]="child.value" [disabled]="child.disabled">
              {{ child.label }}
            </mat-option>
          </mat-optgroup>
          <mat-option *ngIf="!item.group" [value]="item.value" [disabled]="item.disabled">{{ item.label }}</mat-option>
        </ng-container>
      </ng-container>
    </mat-select>
  `,
})
export class FormlyFieldSelect extends FieldType {
  @ViewChild(MatSelect, { static: true }) formFieldControl!: MatSelect;
  formControl: FormControl;

  defaultOptions = {
    templateOptions: {
      options: [],
      compareWith(o1: any, o2: any) {
        return o1 === o2;
      },
    },
  };

  backupOptions = [];

  private selectAllValue!: { options: any, value: any[] };

  getSelectAllState(options: any[]) {
    if (this.empty || this.value.length === 0) {
      return 'unchecked';
    }


    return this.value.length !== this.getSelectAllValue(options).length
      ? 'indeterminate'
      : 'checked';
  }

  toggleSelectAll(options: any[]) {
    const selectAllValue = this.getSelectAllValue(options);
    this.formControl.setValue(
      !this.value || this.value.length !== selectAllValue.length
        ? selectAllValue
        : [],
    );
  }

  change($event: MatSelectChange) {
    if (this.to.change) {
      this.to.change(this.field, $event);
    }
  }

  _getAriaLabelledby() {
    if (this.to.attributes && this.to.attributes['aria-labelledby']) {
      return this.to.attributes['aria-labelledby'].toString();
    }

    if (this.formField && this.formField._labelId) {
      return this.formField._labelId;
    }

    return null;
  }

  private getSelectAllValue(options: any[]) {
    if (!this.selectAllValue || options !== this.selectAllValue.options) {
      const flatOptions: any[] = [];
      options.forEach(o => o.group
        ? flatOptions.push(...o.group)
        : flatOptions.push(o),
      );

      this.selectAllValue = {
        options,
        value: flatOptions.filter(o => !o.disabled).map(o => o.value),
      };
    }

    return this.selectAllValue.value;
  }

  filterOptions(filter: HTMLInputElement) {
    if (filter.value.length) {
      const data = [];
      this.backupOptions.forEach(item => {
        if (item.label.toLowerCase().includes(filter.value.toLowerCase())) {
          data.push(item);
        }
      });
      this.to.options = data;
    } else {
      this.to.options = this.backupOptions;
    }
  }

  selectFocus() {
    if (this.backupOptions.length === 0) {
      this.backupOptions = [];
      this.to.options.forEach(item => {
        this.backupOptions.push(item);
      });
    }
  }

  selectBlur() {
    if (this.backupOptions.length) {
      this.to.options = this.backupOptions;
    }
  }
}
