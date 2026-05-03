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
        [name]="name()"
        [matTimepicker]="picker"
        [matTimepickerMin]="minDate()"
        [matTimepickerMax]="maxDate()"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        [formControl]="control"
        (blur)="onTouched()"
      />

      <mat-timepicker-toggle
        matSuffix
        [for]="picker"
        [hidden]="loading()"
        [disabled]="disabled()"
      />

      <mat-timepicker
        [hidden]="loading()"
        [interval]="interval()"
        [options]="options()"
        #picker
      />

      @if (loading()) {
        <mat-spinner
          matSuffix
          class="nmf-mat-loader"
          diameter="22"
          strokeWidth="3"
        ></mat-spinner>
      }

      @if (hint()) {
        <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
      }

      <mat-error>{{ errorMessage() }}</mat-error>
    </mat-form-field>
  `,
})
export class MatInputTimepickerComponent extends MatFormControlBase<Date | null> {
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  interval = input<number | string | null>(null);
  options = input<MatTimepickerOption[] | null>(null);
  override placeholder = input<string>('Select a time');
}
