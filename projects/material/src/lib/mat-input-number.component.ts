import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyBehavior, TextBehavior } from '@ng-modular-forms/behavior';
import { MatFormControlBase } from './mat-form-control-base';
import { formatNumber, parseNumber } from '@ng-modular-forms/core';
import { MatButtonModule } from '@angular/material/button';

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
      class="w-full"
      [appearance]="appearance()"
      [floatLabel]="shouldLabelFloat()"
    >
      @if (label() && !detachLabel()) {
        <mat-label>{{ label() }}</mat-label>
      }

      <input
        matInput
        [ngClass]="classList"
        [name]="name()"
        [type]="formatNumberValue() ? 'text' : 'number'"
        [value]="displayValue()"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        [formControl]="control"
        (blur)="onTouched()"
        (input)="onInput($event)"
        (keydown)="handleKeyDown($event)"
      />

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

      <ng-content></ng-content>

      <mat-error>{{ errorMessage() }}</mat-error>
    </mat-form-field>
  `,
})
export class MatInputNumberComponent extends MatFormControlBase<number | null> {
  formatNumberValue = input<boolean>(false);
  displayValue = signal<string>('');

  behavior = new TextBehavior();
  currencyBehavior = new CurrencyBehavior();

  override writeValue(value: number | null): void {
    super.writeValue(value);
    this.updateDisplayValue(value);
  }

  handleKeyDown(event: KeyboardEvent) {
    this.currencyBehavior.handleKeyDown(event);
  }

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const parsed = parseNumber(raw);

    this.updateDisplayValue(parsed);

    this.onChange(parsed);
  }

  updateDisplayValue(value: number | null) {
    if (this.formatNumberValue() && value != null) {
      this.displayValue.set(formatNumber(value) ?? '');
    } else {
      this.displayValue.set(value != null ? String(value) : '');
    }
  }
}
