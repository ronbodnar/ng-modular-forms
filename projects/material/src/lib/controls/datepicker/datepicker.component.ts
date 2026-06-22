import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import type {
  DateFilterFn,
  MatCalendarCellClassFunction,
  MatCalendarView,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormControlBase } from '../../base/mat-form-control-base';

@Component({
  selector: 'nmf-mat-datepicker',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
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
    >
      @if (translatedLabel() && !detachLabel()) {
        <mat-label>{{ translatedLabel() }}</mat-label>
      }

      <input
        #focusable
        matInput
        [id]="id()"
        [name]="name()"
        [min]="minDate()"
        [max]="maxDate()"
        [matDatepicker]="picker"
        [matDatepickerFilter]="dateFilter()"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        [autocomplete]="autocompleteAttr()"
        [formControl]="displayControl"
        (blur)="onFocusOut()"
        (focus)="onFocusIn()"
        (dateInput)="onInput($event)"
        (dateChange)="onInput($event)"
      />

      <mat-datepicker-toggle
        matSuffix
        [for]="picker"
        [hidden]="loading()"
        [disabled]="disabled()"
      ></mat-datepicker-toggle>

      <mat-datepicker
        [hidden]="loading()"
        [startAt]="startAt()"
        [startView]="startView()"
        [touchUi]="touchUi()"
        [dateClass]="dateClass()"
        [panelClass]="panelClass()"
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

      @if (translatedHint()) {
        <mat-hint [ngClass]="hintClassList()">{{ translatedHint() }}</mat-hint>
      }

      <mat-error>{{ translatedErrorMessage() }}</mat-error>
    </mat-form-field>
  `,
})
export class MatInputDatepickerComponent extends MatFormControlBase<Date | null> {
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);
  dateClass = input<MatCalendarCellClassFunction<Date>>(() => []);
  dateFilter = input<DateFilterFn<Date | null>>(() => true);
  startAt = input<Date | null>(null);
  startView = input<MatCalendarView>('month');
  panelClass = input<string>('');
  touchUi = input<boolean>(false);
  override placeholder = input<string>('Select a date');

  onInput(event: MatDatepickerInputEvent<Date>): void {
    const rawValue = (event.targetElement as HTMLInputElement).value;
    const value = rawValue ? new Date(rawValue) : null;

    this.onChange(value);
  }
}
