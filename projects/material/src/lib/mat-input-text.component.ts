import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InputTextBehavior } from '@ng-modular-forms/behavior';
import { MatFormControlBase } from './mat-form-control-base';
import { formatNumber, parseNumber } from '@ng-modular-forms/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'nmf-mat-text',
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
        autocomplete="off"
        [id]="id"
        [name]="name"
        [type]="computedType()"
        [value]="displayValue()"
        [disabled]="disabled"
        [required]="required"
        [readonly]="readonly"
        [placeholder]="placeholder"
        [ngClass]="classList"
        (input)="onInput($event)"
        (blur)="onTouched()"
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

      @if (type() === 'password' && !loading()) {
        <button
          matIconSuffix
          mat-icon-button
          color="transparent"
          class="nmf-password-toggle"
          [disabled]="disabled"
          (click)="behavior.toggleShowPassword($event)"
        >
          <mat-icon>{{
            behavior.showPassword() ? 'visibility_off' : 'visibility'
          }}</mat-icon>
        </button>
      }

      <ng-content></ng-content>

      <mat-error>{{ errorMessage() }}</mat-error>
    </mat-form-field>
  `,
})
export class MatInputTextComponent extends MatFormControlBase<
  string | number | null
> {
  type = input<
    'text' | 'number' | 'email' | 'tel' | 'url' | 'password' | 'search'
  >('text');
  formatNumberValue = input<boolean>(false);
  displayValue = signal<string>('');

  behavior = new InputTextBehavior();

  computedType = computed(() =>
    (this.behavior.showPassword() && this.type() === 'password') ||
    (this.type() === 'number' && this.formatNumberValue())
      ? 'text'
      : this.type(),
  );

  override writeValue(value: string | number | null): void {
    super.writeValue(value);
    this.updateDisplayValue(value);
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
