import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyBehavior } from '@ng-modular-forms/behavior';
import {
  formatNumber,
  FormControlBase,
  parseNumber,
} from '@ng-modular-forms/core';

@Component({
  selector: 'nmf-currency',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./input-styles.css'],
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

      <div class="nmf-input-wrapper nmf-input-prefix">
        @if (displayValue() != null) {
          <span
            class="nmf-prefix"
            [class.error]="hasErrors()"
            [class.nmf-prefix-disabled]="disabled()"
            [style.color]="textColor()"
          >
            $
          </span>
        }

        <input
          type="text"
          autocomplete="off"
          class="nmf-input"
          [ngClass]="classList()"
          [class.error]="hasErrors()"
          [class.disabled]="disabled()"
          [class.nmf-input-with-prefix]="displayValue() != null"
          [style.color]="textColor()"
          [id]="id()"
          [name]="name()"
          [value]="displayValue()"
          [disabled]="disabled()"
          [required]="isRequired()"
          [placeholder]="placeholder()"
          (blur)="onTouched()"
          (input)="onInput($event)"
          (keydown)="handleKeyDown($event)"
        />
      </div>

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
export class InputCurrencyComponent extends FormControlBase<number | null> {
  displayValue = signal<string | null>(null);

  behavior = new CurrencyBehavior();

  override writeValue(value: number | null): void {
    super.writeValue(value);
    this.displayValue.set(value != null ? formatNumber(value) : null);
  }

  handleKeyDown(event: KeyboardEvent): void {
    this.behavior.handleKeyDown(event);
  }

  onInput(event: Event) {
    if (this._disabledByInput()) return;

    const rawValue = (event.target as HTMLInputElement).value ?? null;
    const value = parseNumber(rawValue);

    this.displayValue.set(value != null ? formatNumber(value) : null);

    this.onChange(value);
  }

  textColor = computed(() => {
    const value = this.displayValue();
    if (this._disabledByInput() || !value) {
      return 'inherit';
    }

    const parsedValue = parseNumber(value);
    const valid = parsedValue != null && parsedValue >= 0;

    return valid ? 'inherit' : '#dc6262';
  });
}
