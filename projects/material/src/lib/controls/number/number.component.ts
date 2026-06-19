import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormControlBase } from '../../base/mat-form-control-base';
import { formatNumber, parseNumber } from '@ng-modular-forms/core';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'nmf-mat-number',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label() && detachLabel()) {
      <label class="font-medium text-base">{{ label() }}</label>
    }

    <mat-form-field
      class="nmf-mat-field"
      [appearance]="appearance()"
      [floatLabel]="shouldLabelFloat()"
    >
      @if (label() && !detachLabel()) {
        <mat-label>{{ label() }}</mat-label>
      }

      <div class="nmf-mat-prefix-slot">
        @if (prefix() != null) {
          <span>{{ prefix() }}</span>
        }
        <ng-content select="[nmfPrefix]"></ng-content>
      </div>

      <input
        #focusable
        matInput
        type="text"
        [ngClass]="classList"
        [style.color]="textColor()"
        [style.opacity]="disabled() ? 0.6 : 1"
        [id]="id()"
        [name]="name()"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        [autocomplete]="autocompleteAttr()"
        [formControl]="displayControl"
        (blur)="onTouched()"
        (input)="onInput($event)"
      />

      <div class="nmf-mat-suffix-slot">
        @if (suffix() != null) {
          <span>{{ suffix() }}</span>
        }
        <ng-content select="[nmfSuffix]"></ng-content>
      </div>

      @if (loading()) {
        <mat-spinner
          matSuffix
          class="nmf-mat-loader"
          diameter="22"
          strokeWidth="3"
        ></mat-spinner>
      }

      @if (hint()) {
        <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
      }

      <mat-error>{{ errorMessage() }}</mat-error>
    </mat-form-field>
  `,
})
export class MatInputNumberComponent extends MatFormControlBase<
  string | number | null
> {
  formatValue = input<boolean>(false);
  prefix = input<string | null>(null);
  suffix = input<string | null>(null);
  allowNegative = input<boolean>(true);
  negativeColor = input<string | null>('#dc2626');

  private readonly displayValue = toSignal(this.displayControl.valueChanges, {
    initialValue: this.displayControl.value,
  });

  readonly textColor = computed(() => {
    const value = this.displayValue();
    if (
      value == null ||
      value === '' ||
      this.negativeColor() == null ||
      this._disabledByInput()
    ) {
      return 'inherit';
    }

    const parsedValue = parseNumber(value ?? 0);
    const valid = parsedValue != null && parsedValue >= 0;

    return valid ? 'inherit' : this.negativeColor();
  });

  override writeValue(value: number | null): void {
    super.writeValue(value);
    this.updateDisplayValue(value);
  }

  onInput(_: Event): void {
    const raw = this.displayControl.value ?? '';
    const cleaned = this.sanitize(raw, this.allowNegative());
    const parsed = parseNumber(cleaned);

    this.updateDisplayValue(cleaned);
    this.onChange(parsed);
  }

  updateDisplayValue(value: number | string | null) {
    const shouldFormat = this.formatValue() && value != null;
    const displayValue = shouldFormat
      ? (formatNumber(value) ?? '')
      : value != null
        ? String(value)
        : '';

    this.displayControl.setValue(displayValue, {
      emitEvent: false,
    });
  }

  private sanitize(value: string, allowNegative: boolean): string {
    if (!value) return '';

    let cleaned = value.replace(/[^0-9.-]/g, '');

    const isJustMinus = cleaned === '-';
    if (isJustMinus && allowNegative) return '-';

    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    const hasMinus = cleaned.includes('-');
    if (hasMinus) {
      cleaned = cleaned.replace(/-/g, '');
      if (allowNegative) {
        cleaned = '-' + cleaned;
      }
    }

    return cleaned;
  }
}
