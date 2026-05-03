import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyBehavior, TextBehavior } from '@ng-modular-forms/behavior';
import {
  formatNumber,
  FormControlBase,
  parseNumber,
} from '@ng-modular-forms/core';

@Component({
  selector: 'nmf-number',
  standalone: true,
  styleUrls: ['./input-styles.css'],
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nmf-field">
      @if (label()) {
        <label class="nmf-label">
          {{ label() }}
          @if (isRequired()) {
            <span class="nmf-required">*</span>
          }
        </label>
      }

      <input
        autocomplete="off"
        class="nmf-input"
        [ngClass]="classList()"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
        [id]="id()"
        [name]="name()"
        [type]="formatNumberValue() ? 'text' : 'number'"
        [value]="displayValue()"
        [disabled]="disabled()"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        (blur)="onTouched()"
        (input)="onInput($event)"
        (keydown)="handleKeyDown($event)"
      />

      <ng-content></ng-content>

      <p class="nmf-error">
        {{ errorMessage() }}
      </p>

      @if (loading()) {
        <div class="nmf-loading">
          <span class="nmf-spinner"></span>
        </div>
      }
    </div>
  `,
})
export class InputNumberComponent extends FormControlBase<
  string | number | null
> {
  formatNumberValue = input<boolean>(false);
  displayValue = signal<string>('');

  behavior = new TextBehavior();
  currencyBehavior = new CurrencyBehavior();

  override writeValue(value: string | number | null): void {
    super.writeValue(value);
    this.updateDisplayValue(value);
  }

  handleKeyDown(event: KeyboardEvent) {
    this.currencyBehavior.handleKeyDown(event);
  }

  onInput(event: Event): void {
    if (this._disabledByInput()) return;

    const raw = (event.target as HTMLInputElement).value;
    const parsed = parseNumber(raw);

    this.updateDisplayValue(parsed);

    this.onChange(parsed);
  }

  updateDisplayValue(value: string | number | null) {
    if (this.formatNumberValue() && value != null) {
      this.displayValue.set(formatNumber(value) ?? '');
    } else {
      this.displayValue.set(value != null ? String(value) : '');
    }
  }
}
