import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormControlBase } from '../../base/mat-form-control-base';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import type {
  MatTimepickerOption,
  MatTimepickerSelected,
} from '@angular/material/timepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'nmf-mat-timepicker',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTimepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (translatedLabel() && detachLabel()) {
      <label class="nmf-mat-label-detached">{{ translatedLabel() }}</label>
    }

    <mat-form-field
      class="nmf-mat-field"
      [appearance]="appearance()"
      [floatLabel]="shouldLabelFloat()"
      [hideRequiredMarker]="hideRequiredMarker()"
    >
      @if (translatedLabel() && !detachLabel()) {
        <mat-label>{{ translatedLabel() }}</mat-label>
      }

      <input
        #focusable
        matInput
        [id]="id()"
        [name]="name()"
        [matTimepicker]="picker"
        [matTimepickerMin]="minDate()"
        [matTimepickerMax]="maxDate()"
        [required]="isRequired()"
        [placeholder]="translatedPlaceholder()"
        [autocomplete]="autocompleteAttr()"
        [formControl]="displayControl"
        (blur)="onFocusOut()"
        (focus)="onFocusIn()"
        (input)="onInput($event)"
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
        (selected)="onSelected($event)"
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

      @if (translatedHintLabel()) {
        <mat-hint [ngClass]="hintClassList()">{{
          translatedHintLabel()
        }}</mat-hint>
      }

      <mat-error>{{ translatedErrorMessage() }}</mat-error>
    </mat-form-field>
  `,
})
export class MatInputTimepickerComponent extends MatFormControlBase<
  Date | null,
  Date
> {
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  interval = input<number | string | null>(null);
  options = input<MatTimepickerOption[] | null>(null);
  override placeholder = input<string>('Select a time');

  onInput(event: Event): void {
    const rawValue = (event.target as HTMLInputElement).value;
    const value = rawValue ? new Date(rawValue) : null;

    this.onChange(value);
  }

  onSelected(event: MatTimepickerSelected<unknown>): void {
    this.onChange(event.value as Date);
  }
}
