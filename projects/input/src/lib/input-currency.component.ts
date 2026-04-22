import {
  ChangeDetectionStrategy,
  Component,
  Optional,
  Self,
  signal,
} from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputCurrencyBehavior } from '@ng-modular-forms/behavior';
import { InputFormControlBase } from './input-form-control-base';
import { formatNumber, parseNumber } from '@ng-modular-forms/core';

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
          @if (required) {
            <span class="nmf-required">*</span>
          }
        </label>
      }

      <div class="nmf-input-wrapper nmf-input-prefix">
        @if (value != null) {
          <span
            class="nmf-prefix"
            [class.error]="errorState"
            [class.nmf-prefix-disabled]="disabled || readonly"
          >
            $
          </span>
        }

        <input
          type="text"
          autocomplete="off"
          class="nmf-input"
          [class.error]="errorState"
          [class.readonly]="readonly"
          [class.nmf-input-with-prefix]="value != null"
          [id]="id"
          [name]="name"
          [value]="displayValue()"
          [disabled]="disabled"
          [readonly]="readonly"
          [ngClass]="classList()"
          [placeholder]="placeholder || '0.00'"
          (keydown)="handleKeyDown($event)"
          (input)="onInput($event)"
          (blur)="onTouched()"
          [style.color]="textColor(value)"
        />
      </div>

      <ng-content></ng-content>

      <p class="nmf-error">
        {{ getErrorMessage() }}
      </p>
    </div>
  `,
})
export class InputCurrencyComponent extends InputFormControlBase<
  number | null
> {
  constructor(@Optional() @Self() ngControl: NgControl) {
    super();
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  displayValue = signal<string | null>(null);

  behavior = new InputCurrencyBehavior();

  override writeValue(value: number | null): void {
    super.writeValue(value);
    this.displayValue.set(value != null ? formatNumber(value) : null);
  }

  handleKeyDown(event: KeyboardEvent): void {
    this.behavior.handleKeyDown(event);
  }

  onInput(event: Event) {
    const rawValue = (event.target as HTMLInputElement).value ?? null;
    const value = parseNumber(rawValue);

    this.displayValue.set(value != null ? formatNumber(value) : null);

    this.value = value;
    this.onChange(value);
  }

  textColor(value: string | number | null): string {
    if (this.disabled || this.readonly) {
      return 'inherit';
    }
    if (!value) {
      return 'inherit';
    }

    const parsedValue = parseNumber(value);
    const valid = parsedValue != null && parsedValue >= 0;

    return valid ? 'inherit' : 'red';
  }
}
