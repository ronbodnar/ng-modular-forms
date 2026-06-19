import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormControlBase } from '../../base/mat-form-control-base';
import {
  formatNumber,
  parseNumber,
  NumberBehavior,
  PasswordBehavior,
} from '@ng-modular-forms/core';
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
        #focusable
        matInput
        [ngClass]="classList"
        [id]="id()"
        [name]="name()"
        [type]="formatValue() ? 'text' : 'number'"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        [autocomplete]="autocompleteAttr()"
        [formControl]="displayControl"
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
export class MatInputNumberComponent extends MatFormControlBase<
  string | number | null
> {
  formatValue = input<boolean>(false);
  behavior = new PasswordBehavior();
  currencyBehavior = new NumberBehavior();

  override writeValue(value: number | null): void {
    super.writeValue(value);
    this.updateDisplayValue(value);
  }

  handleKeyDown(event: KeyboardEvent) {
    this.currencyBehavior.blockNonDigitKey(event);
  }

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const parsed = parseNumber(raw);

    this.updateDisplayValue(parsed);
    this.onChange(parsed);
  }

  updateDisplayValue(value: number | null) {
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
}
