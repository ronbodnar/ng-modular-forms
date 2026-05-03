import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormControlBase } from './mat-form-control-base';
import { formatNumber, parseNumber } from '@ng-modular-forms/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { CurrencyBehavior } from '@ng-modular-forms/behavior';

@Component({
  selector: 'nmf-mat-currency',
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label() && detachLabel()) {
      <label class="font-medium text-base">{{ label() }}</label>
    }

    <mat-form-field
      class="w-full"
      [appearance]="appearance()"
      [floatLabel]="shouldLabelFloat()"
    >
      @if (label() && !detachLabel()) {
        <mat-label>{{ label() }}</mat-label>
      }

      @if (displayValue()) {
        <span
          matTextPrefix
          [class.nmf-disabled]="disabled()"
          [style.color]="textColor()"
          [style.opacity]="disabled() ? 0.6 : 1"
          >$</span
        >
      }

      <input
        matInput
        type="text"
        [ngClass]="classList()"
        [style.color]="textColor()"
        [style.opacity]="disabled() ? 0.6 : 1"
        [name]="name()"
        [value]="displayValue()"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        [formControl]="control"
        (blur)="onTouched()"
        (input)="onInput($event)"
        (keydown)="handleKeyDown($event)"
      />

      <span matTextSuffix>
        <ng-content></ng-content>
      </span>

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

      <mat-error>
        {{ errorMessage() }}
      </mat-error>
    </mat-form-field>
  `,
})
export class MatInputCurrencyComponent extends MatFormControlBase<
  number | null
> {
  behavior = new CurrencyBehavior();

  displayValue = signal<string | null>(null);

  override writeValue(value: number | null): void {
    super.writeValue(value);
    this.displayValue.set(value != null ? formatNumber(value) : null);
  }

  handleKeyDown(event: KeyboardEvent): void {
    this.behavior.handleKeyDown(event);
  }

  onInput(event: Event) {
    const rawValue = (event.target as HTMLInputElement).value;
    const value = parseNumber(rawValue);

    this.displayValue.set(value != null ? formatNumber(value) : null);

    this.onChange(value);
  }

  textColor = computed(() => {
    const value = this.displayValue();
    if (this._disabledByInput() || !value) {
      return '';
    }

    const parsedValue = parseNumber(value);
    const valid = parsedValue != null && parsedValue >= 0;

    return valid ? '' : 'red';
  });
}
