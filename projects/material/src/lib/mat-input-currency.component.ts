import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFormControlBase } from './mat-form-control-base';
import { parseCurrency } from '@ng-modular-forms/core';
import { InputCurrencyBehavior } from '@ng-modular-forms/behavior';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'nmf-mat-input-currency',
  imports: [
    CommonModule,
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
      appearance="outline"
      [floatLabel]="shouldLabelFloat ? 'always' : 'auto'"
    >
      @if (label() && !detachLabel()) {
        <mat-label>{{ label() }}</mat-label>
      }

      <span
        [style.color]="
          control().disabled || readonly
            ? 'var(--mat-form-field-outlined-disabled-input-text-text)'
            : 'inherit'
        "
        matTextPrefix
      >
        $
      </span>

      <input
        matInput
        type="text"
        autocomplete="off"
        [id]="id"
        [name]="name"
        [value]="value"
        [disabled]="disabled"
        [readonly]="readonly"
        [ngClass]="classList().concat(readonly ? ['opacity-60'] : [])"
        [placeholder]="placeholder || '0.00'"
        (keydown)="handleKeyDown($event)"
        (input)="onInput($event)"
        (blur)="onTouched()"
        style="padding-top: 5px; color: {{ textColor(value) }} !important"
      />

      <span matTextSuffix><ng-content></ng-content></span>

      @if (loading()) {
        <div class="absolute top-5 right-5 z-10">
          <mat-spinner diameter="20" strokeWidth="3"></mat-spinner>
        </div>
      }

      @if (hint()) {
        <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
      }

      @if (control().invalid && control().touched) {
        <mat-error>
          {{ getErrorMessage() }}
        </mat-error>
      }
    </mat-form-field>
  `,
})
export class MatInputCurrencyComponent extends MatFormControlBase<
  string | null
> {
  behavior = new InputCurrencyBehavior();

  override writeValue(value: string | null): void {
    super.writeValue(this.behavior.formatCurrency(value ?? ''));
  }

  handleKeyDown(event: KeyboardEvent) {
    this.behavior.handleKeyDown(event);
  }

  onInput(event: Event) {
    this.behavior.onInput(this, event);
  }

  textColor(value: string | number | null): string {
    if (this.disabled) {
      return 'default';
    }
    if (!value) {
      return '--mat-form-field-outlined-input-text-text';
    }
    return parseCurrency(value) >= 0
      ? '--mat-form-field-outlined-input-text-text'
      : 'red';
  }
}
