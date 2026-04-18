import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControlBase, parseCurrency } from '@ng-modular-forms/core';
import { InputCurrencyBehavior } from '@ng-modular-forms/behavior';

@Component({
  selector: 'nmf-input-currency',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nmf-input-wrapper relative">
      @if (label()) {
        <label class="block font-medium mb-1">{{ label() }}</label>
      }

      <div class="flex items-center gap-1">
        <span [class.opacity-50]="disabled || readonly"> $ </span>

        <input
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
          class="flex-1 border rounded px-2 py-1"
          [style.color]="textColor(value)"
        />
      </div>

      <ng-content></ng-content>

      @if (control().invalid && control().touched) {
        <p class="text-red-500 text-sm mt-1">
          {{ getErrorMessage() }}
        </p>
      }
    </div>
  `,
})
export class InputCurrencyComponent extends FormControlBase<string | null> {
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
    const defaultColor = '--mat-form-field-outlined-input-text-text';

    return parseCurrency(value) >= 0 ? defaultColor : 'red';
  }
}
