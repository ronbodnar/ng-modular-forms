import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FormControlBase } from '../../base/form-control-base';
import { TextBehavior } from '../../behavior/text/text.behavior';
import { CurrencyBehavior } from '../../behavior/currency/currency.behavior';
import { parseNumber, formatNumber } from '../../number-utils';

@Component({
  selector: 'nmf-number',
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
        #focusable
        class="nmf-input"
        [ngClass]="classList()"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
        [id]="id()"
        [name]="name()"
        [type]="formatValue() ? 'text' : 'number'"
        [value]="displayValue()"
        [disabled]="disabled()"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        [autocomplete]="autocompleteAttr()"
        (blur)="onTouched()"
        (input)="onInput($event)"
        (keydown)="handleKeyDown($event)"
      />
    </nmf-form-field>
  `,
})
export class InputNumberComponent extends FormControlBase<
  string | number | null
> {
  formatValue = input<boolean>(false);
  displayValue = signal<string>('');

  behavior = new TextBehavior();
  currencyBehavior = new CurrencyBehavior();

  override writeValue(value: string | number | null): void {
    super.writeValue(value);
    this.updateDisplayValue(value);
  }

  handleKeyDown(event: KeyboardEvent) {
    this.currencyBehavior.blockNonDigitKey(event);
  }

  onInput(event: Event): void {
    if (this._disabledByInput()) return;

    const raw = (event.target as HTMLInputElement).value;
    const parsed = parseNumber(raw);

    this.updateDisplayValue(parsed);

    this.onChange(parsed);
  }

  updateDisplayValue(value: string | number | null) {
    if (this.formatValue() && value != null) {
      this.displayValue.set(formatNumber(value) ?? '');
    } else {
      this.displayValue.set(value != null ? String(value) : '');
    }
  }
}
