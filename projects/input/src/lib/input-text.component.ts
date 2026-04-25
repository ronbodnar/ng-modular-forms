import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  Optional,
  Self,
  signal,
} from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  InputCurrencyBehavior,
  InputTextBehavior,
} from '@ng-modular-forms/behavior';
import { InputFormControlBase } from './input-form-control-base';
import { formatNumber, parseNumber } from '@ng-modular-forms/core';

@Component({
  selector: 'nmf-text',
  standalone: true,
  styleUrls: ['./input-styles.css'],
  imports: [CommonModule, ReactiveFormsModule],
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

      <div class="nmf-input-wrapper">
        <input
          autocomplete="off"
          class="nmf-input"
          [class.error]="errorState"
          [class.readonly]="readonly"
          [ngClass]="classList()"
          [id]="id"
          [name]="name"
          [value]="displayValue()"
          [type]="type()"
          [readonly]="readonly"
          [required]="required"
          [disabled]="disabled"
          [placeholder]="placeholder"
          (input)="onInput($event)"
          (keydown)="handleKeyDown($event)"
          (blur)="onTouched()"
        />

        @if (type() === 'password') {
          <button
            type="button"
            (click)="behavior.toggleShowPassword($event)"
            class="nmf-password-toggle"
            aria-label="Toggle password visibility"
          >
            @if (behavior.showPassword()) {
              <ng-container [ngTemplateOutlet]="eyeOffIcon"></ng-container>
            } @else {
              <ng-container [ngTemplateOutlet]="eyeIcon"></ng-container>
            }
          </button>
        }
      </div>

      <ng-content></ng-content>

      <p class="nmf-error">
        {{ getErrorMessage() }}
      </p>

      @if (loading()) {
        <div class="nmf-loading">
          <span class="nmf-spinner"></span>
        </div>
      }
    </div>

    <ng-template #eyeIcon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#e3e3e3"
        class="nmf-icon"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
        />
      </svg>
    </ng-template>

    <ng-template #eyeOffIcon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#e3e3e3"
        class="nmf-icon"
      >
        <path
          d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z"
          fill="none"
        />
        <path
          d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
        />
      </svg>
    </ng-template>
  `,
})
export class InputTextComponent extends InputFormControlBase<
  string | number | null
> {
  type = input<
    'text' | 'number' | 'email' | 'tel' | 'url' | 'password' | 'search'
  >('text');
  formatNumberValue = input<boolean>(false);
  displayValue = signal<string>('');

  computedType = computed(() =>
    (this.behavior.showPassword() && this.type() === 'password') ||
    (this.type() === 'number' && this.formatNumberValue())
      ? 'text'
      : this.type(),
  );

  behavior = new InputTextBehavior();
  currencyBehavior = new InputCurrencyBehavior();

  constructor(@Optional() @Self() ngControl: NgControl) {
    super();
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  override writeValue(value: string | number | null): void {
    super.writeValue(value);
    this.updateDisplayValue(value);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (this.type() !== 'number') {
      return;
    }
    this.currencyBehavior.handleKeyDown(event);
  }

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;

    const parsed = this.type() === 'number' ? parseNumber(raw) : raw;

    this.updateDisplayValue(parsed);

    this.value = parsed;
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
