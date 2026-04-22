import {
  ChangeDetectionStrategy,
  Component,
  input,
  Optional,
  Self,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { InputFormControlBase } from './input-form-control-base';

@Component({
  selector: 'nmf-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./input-styles.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nmf-field">
      @if (label()) {
        <label class="nmf-label">
          {{ label() }}
          @if (required) {
            <span class="nmf-required">*</span>
          }
        </label>
      }

      @if (loading()) {
        <div class="absolute right-2 top-2 text-sm opacity-60">Loading...</div>
      }

      <input
        type="date"
        autocomplete="off"
        class="nmf-input"
        [class.error]="errorState"
        [class.readonly]="readonly"
        [id]="id"
        [name]="name"
        [value]="value"
        [ngClass]="classList()"
        [min]="formatDate(minDate())"
        [max]="formatDate(maxDate())"
        [disabled]="disabled"
        [readonly]="readonly"
        [placeholder]="placeholder || ''"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />

      <ng-content></ng-content>

      <p class="nmf-error">
        {{ getErrorMessage() }}
      </p>
    </div>
  `,
})
export class InputDatepickerComponent extends InputFormControlBase<Date | null> {
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);

  constructor(@Optional() @Self() ngControl: NgControl) {
    super();
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  formatDate(date: Date | null | undefined): string | null {
    if (!date) return null;

    // yyyy-MM-dd (required by input[type="date"])
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  parseDate(value: string): Date | null {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const parsed = this.parseDate(input.value);

    this.onChange(parsed); //this.value
  }
}
