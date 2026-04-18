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
  MatCalendar,
  MatDatepicker,
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormControlBase } from './mat-form-control-base';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nmf-mat-input-datepicker',
  imports: [
    CommonModule,
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
      appearance="outline"
      [floatLabel]="shouldLabelFloat ? 'always' : 'auto'"
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
        [type]="'text'"
        [readonly]="readonly"
        [placeholder]="placeholder || 'Select a date'"
        [disabled]="disabled"
        [matDatepicker]="picker"
        (dateInput)="onInput($event)"
        (dateChange)="onInput($event)"
        (blur)="onTouched()"
        style="padding-top: 5px"
      />

      <mat-datepicker-toggle
        [hidden]="loading()"
        matSuffix
        [for]="picker"
      ></mat-datepicker-toggle>

      <mat-datepicker [hidden]="loading()" #picker>
        <!--         <mat-datepicker-actions>
          <button matButton (click)="setToday(picker)">Hoy</button>
          <button matButton matDatepickerCancel>Cancelar</button>
          <button matButton="elevated" matDatepickerApply>Aplicar</button>
        </mat-datepicker-actions> -->
      </mat-datepicker>

      @if (loading()) {
        <div class="absolute top-2 right-2">
          <mat-spinner diameter="24" strokeWidth="3"></mat-spinner>
        </div>
      }

      @if (hint()) {
        <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
      }

      @if (control().invalid && control().touched) {
        <mat-error>
          {{ getErrorMessage() }}
        </mat-error>
      }
    </mat-form-field>
  `,
})
export class MatInputDatepickerComponent extends MatFormControlBase<Date | null> {
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);

  picker!: MatCalendar<Date>;

  private readonly dateAdapter = inject(DateAdapter<Date>);

  setToday(dp: MatDatepicker<Date>) {
    const today = this.dateAdapter.today();
    dp.select(today);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.picker.minDate = this.minDate();
    this.picker.maxDate = this.maxDate();
  }

  onInput(event: Partial<MatDatepickerInputEvent<Date>>): void {
    const value = event.value;

    if (!value) {
      this.value = null;
      this.onChange(this.value);
      this.stateChanges.next();
      return;
    }

    this.value = value;
    this.onChange(this.value);
    this.stateChanges.next();
  }
}
