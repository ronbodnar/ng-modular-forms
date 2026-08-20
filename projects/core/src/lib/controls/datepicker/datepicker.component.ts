import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FormControlBase } from '../../base/form-control-base';

@Component({
  selector: 'nmf-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
  `,
  template: `
    <nmf-form-field
      [label]="translatedLabel()"
      [isRequired]="isRequired()"
      [loading]="loading()"
      [errorMessage]="translatedErrorMessage()"
      [hintLabel]="translatedHintLabel()"
      [hintClassList]="hintClassList()"
    >
      <div
        class="nmf-control-wrapper"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
      >
        <input
          #focusable
          type="date"
          class="nmf-control"
          [ngClass]="classList()"
          [id]="id()"
          [min]="formatDate(minDate())"
          [max]="formatDate(maxDate())"
          [name]="name()"
          [value]="displayValue()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="isRequired()"
          [placeholder]="translatedPlaceholder()"
          [attr.aria-label]="ariaLabel() ?? translatedLabel()"
          [attr.aria-describedby]="ariaDescribedBy()"
          [attr.aria-labelledby]="ariaLabelledBy()"
          [attr.autocomplete]="autocomplete()"
          (blur)="onFocusOut()"
          (focus)="onFocusIn()"
          (input)="onInput($event)"
        />
      </div>
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
