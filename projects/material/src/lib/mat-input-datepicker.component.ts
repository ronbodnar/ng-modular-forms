import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import {
  DateFilterFn,
  MatCalendarCellClassFunction,
  MatCalendarView,
  MatDatepicker,
  MatDatepickerInputEvent,
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
        [id]="id"
        [name]="name"
        [value]="value"
        [min]="minDate()"
        [max]="maxDate()"
        [readonly]="readonly"
        [required]="required"
        [disabled]="disabled"
        [placeholder]="placeholder || 'Select a date'"
        [matDatepicker]="picker"
        [matDatepickerFilter]="dateFilter()"
        (dateInput)="onInput($event)"
        (dateChange)="onInput($event)"
        (blur)="onTouched()"
      />

      <mat-datepicker-toggle
        matSuffix
        [for]="picker"
        [hidden]="loading()"
        [disabled]="disabled"
      ></mat-datepicker-toggle>

      <mat-datepicker
        [hidden]="loading()"
        [dateClass]="dateClass()"
        [panelClass]="panelClass()"
        [startAt]="startAt()"
        [startView]="startView()"
        [touchUi]="touchUi()"
        #picker
      >
        <!--         <mat-datepicker-actions>
          <button matButton (click)="setToday(picker)">Today</button>
          <button matButton matDatepickerCancel>Cancel</button>
          <button matButton="elevated" matDatepickerApply>Apply</button>
        </mat-datepicker-actions> -->
      </mat-datepicker>

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

  private readonly dateAdapter = inject(DateAdapter<Date>);

  setToday(dp: MatDatepicker<Date>) {
    const today = this.dateAdapter.today();
    dp.select(today);
  }

  onInput(event: MatDatepickerInputEvent<Date>): void {
    this.value = event.value;
    this.onChange(event.value);
  }
}
