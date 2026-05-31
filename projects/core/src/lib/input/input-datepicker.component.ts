import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlBase } from '../base/form-control-base';
import { FormFieldComponent } from './form-field.component';

@Component({
  selector: 'nmf-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nmf-form-field
      [label]="label()"
      [isRequired]="isRequired()"
      [loading]="loading()"
      [errorMessage]="errorMessage()"
    >
      <input
        type="date"
        class="nmf-input"
        [ngClass]="classList()"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
        [id]="id"
        [min]="formatDate(minDate())"
        [max]="formatDate(maxDate())"
        [name]="name()"
        [value]="displayValue()"
        [disabled]="disabled()"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        (blur)="onTouched()"
        (input)="onInput($event)"
      />
    </nmf-form-field>
  `,
})
export class InputDatepickerComponent extends FormControlBase<Date | null> {
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);

  displayValue = signal<string>('');

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

  override writeValue(value: Date | null): void {
    super.writeValue(value);

    this.displayValue.set(this.formatDate(value) ?? '');
  }

  onInput(event: Event): void {
    if (this._disabledByInput()) return;

    const input = event.target as HTMLInputElement;
    const parsed = this.parseDate(input.value);

    this.displayValue.set(this.formatDate(parsed) ?? '');

    this.onChange(parsed);
  }
}
