import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormControlBase } from './mat-form-control-base';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import {
  MatTimepickerModule,
  MatTimepickerOption,
  MatTimepickerSelected,
} from '@angular/material/timepicker';

@Component({
  selector: 'nmf-mat-timepicker',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTimepickerModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label() && detachLabel()) {
      <label class="font-medium text-base">{{ label() }}</label>
    }

    <mat-form-field
      class="w-full"
      [appearance]="appearance()"
      [floatLabel]="shouldLabelFloat()"
    >
      @if (label() && !detachLabel()) {
        <mat-label>{{ label() }}</mat-label>
      }

      <input
        matInput
        autocomplete="off"
        [id]="id"
        [name]="name"
        [value]="value"
        [matTimepickerMin]="minDate()"
        [matTimepickerMax]="maxDate()"
        [disabled]="_disabled()"
        [readonly]="readonly"
        [placeholder]="placeholder || 'Select a date'"
        [matTimepicker]="picker"
        (blur)="onTouched()"
      />

      <mat-timepicker-toggle
        matSuffix
        [for]="picker"
        [hidden]="loading()"
        [disabled]="_disabled()"
      />

      <mat-timepicker
        [hidden]="loading()"
        [interval]="interval()"
        [options]="options()"
        (selected)="onInput($event)"
        #picker
      />

      @if (loading()) {
        <mat-spinner
          class="nmf-mat-suffix"
          matSuffix
          diameter="22"
          strokeWidth="3"
        ></mat-spinner>
      }

      @if (hint()) {
        <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
      }

      <mat-error>{{ getErrorMessage() }}</mat-error>
    </mat-form-field>
  `,
})
export class MatInputTimepickerComponent extends MatFormControlBase<Date | null> {
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  interval = input<number | string | null>(null);
  options = input<MatTimepickerOption[] | null>(null);

  onInput(event: MatTimepickerSelected<unknown>): void {
    const value = (event as MatTimepickerSelected<Date>).value;
    this.value = value;
    this.onChange(value);
  }
}
