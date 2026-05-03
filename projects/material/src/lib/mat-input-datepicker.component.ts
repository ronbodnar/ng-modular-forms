import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import {
  DateFilterFn,
  MatCalendarCellClassFunction,
  MatCalendarView,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormControlBase } from './mat-form-control-base';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';

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
        [min]="minDate()"
        [max]="maxDate()"
        [matDatepicker]="picker"
        [matDatepickerFilter]="dateFilter()"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        [formControl]="control"
        (blur)="onTouched()"
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

      @if (hint()) {
        <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
      }

      <mat-error>{{ errorMessage() }}</mat-error>
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
}
