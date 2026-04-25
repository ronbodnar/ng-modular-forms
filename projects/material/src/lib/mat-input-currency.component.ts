import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormControlBase } from './mat-form-control-base';
import { formatNumber, parseNumber } from '@ng-modular-forms/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { InputCurrencyBehavior } from '@ng-modular-forms/behavior';

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

      @if (value != null) {
        <span [class.nmf-disabled]="_disabled()" matTextPrefix>$</span>
      }

      <input
        matInput
        type="text"
        autocomplete="off"
        [id]="id"
        [name]="name"
        [value]="displayValue()"
        [ngClass]="classList()"
        [readonly]="readonly"
        [disabled]="_disabled()"
        [placeholder]="placeholder"
        (keydown)="handleKeyDown($event)"
        (input)="onInput($event)"
        (blur)="onTouched()"
      />

      <span matTextSuffix>
        <ng-content></ng-content>
      </span>

      @if (loading()) {
        <mat-spinner
          matSuffix
          class="nmf-mat-suffix"
          diameter="22"
          strokeWidth="3"
        ></mat-spinner>
      }

      @if (hint()) {
        <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
      }

      <mat-error>
        {{ getErrorMessage() }}
      </mat-error>
    </mat-form-field>
  `,
})
export class MatInputCurrencyComponent extends MatFormControlBase<
  number | null
> {
  behavior = new InputCurrencyBehavior();

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

    this.value = value;
    this.onChange(value);
  }
}
