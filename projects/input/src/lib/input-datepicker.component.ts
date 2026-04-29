import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputFormControlBase } from './input-form-control-base';

@Component({
  selector: 'nmf-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./input-styles.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nmf-field" [class.loading]="loading()">
      @if (label()) {
        <label class="nmf-label">
          {{ label() }}
          @if (required) {
            <span class="nmf-required">*</span>
          }
        </label>
      }

      <input
        type="date"
        autocomplete="off"
        class="nmf-input"
        [class.error]="errorState"
        [class.readonly]="readonly"
        [id]="id"
        [name]="name"
        [value]="formatDate(value)"
        [ngClass]="classList()"
        [min]="formatDate(minDate())"
        [max]="formatDate(maxDate())"
        [disabled]="disabled"
        [required]="required"
        [readonly]="readonly"
        [placeholder]="placeholder"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />

      <ng-content></ng-content>

      @if (loading()) {
        <div class="nmf-loading">
          <span class="nmf-spinner"></span>
        </div>
      }

      <p class="nmf-error">
        {{ errorMessage() }}
      </p>
    </div>
  `,
})
export class InputDatepickerComponent extends InputFormControlBase<Date | null> {
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);

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
    if (this.disabled) return;

    const input = event.target as HTMLInputElement;
    const parsed = this.parseDate(input.value);

    this.value = parsed;
    this.onChange(parsed);
  }
}
