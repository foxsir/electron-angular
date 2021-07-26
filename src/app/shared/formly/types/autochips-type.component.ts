import {Component, ViewChild, OnInit, AfterViewInit, ElementRef} from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import {map, startWith, switchMap} from 'rxjs/operators';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'formly-autochips-type',
  template: `
    <mat-form-field style="width: 100%;">
      <mat-label>{{to.label}} {{field.templateOptions.required ? '*' : ''}}</mat-label>
      <mat-chip-list #chipList aria-label="Fruit selection">
        <mat-chip
          *ngFor="let fruit of fruits"
          [selectable]="selectable"
          [removable]="removable"
          (removed)="remove(fruit)">
          {{fruit}}
          <mat-icon matChipRemove *ngIf="removable">cancel</mat-icon>
        </mat-chip>
        <input
          matInput
          #fruitInput
          [formControl]="formControl"
          [matAutocomplete]="auto"
          [matChipInputFor]="chipList"
          [matChipInputAddOnBlur]="true"
          [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
          (matChipInputTokenEnd)="add($event)"
          [placeholder]="to.placeholder"
          [errorStateMatcher]="errorStateMatcher"
          [formlyAttributes]="field">
      </mat-chip-list>
      <mat-autocomplete #auto="matAutocomplete" (optionSelected)="selected($event)">
        <mat-option *ngFor="let fruit of filteredFruits | async" [value]="fruit">
          {{fruit}}
        </mat-option>
      </mat-autocomplete>
      <mat-hint *ngIf="to.description" [id]="null">{{ to.description }}</mat-hint>
    </mat-form-field>
  `,
})
export class AutochipsTypeComponent extends FieldType implements OnInit, AfterViewInit {
  formControl: FormControl;
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = [
    // 'Alabama',
  ];

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  ngOnInit() {
    super.ngOnInit();
    if (this.value && typeof this.value === "object") {
      this.fruits = this.value;
      this.formControl.setValue(this.fruits);
    }

    this.filteredFruits = this.formControl.valueChanges.pipe(
      startWith(""),
      map((fruit: string | null) => fruit ? this._filter(fruit) : this.allFruits.slice()));
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.formControl.setValue(this.fruits);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
      this.formControl.setValue(this.fruits);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.formControl.setValue(this.fruits);
  }

  private _filter(value: any): string[] {
    const filterValue = value;
    if (typeof value === "object") {
      this.fruits = value;
    }
    return this.allFruits.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }
}
