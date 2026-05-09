import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControlBase } from '../base/form-control-base';

export interface SelectOption {
  key: string | number;
  label: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'nmf-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nmf-field" [class.loading]="loading()">
      @if (label()) {
        <label class="nmf-label">
          {{ label() }}
          @if (isRequired()) {
            <span class="nmf-required">*</span>
          }
        </label>
      }
      <div class="select-wrapper" [class.disabled]="disabled()">
        <select
          class="nmf-input"
          [ngClass]="classList()"
          [class.error]="hasErrors()"
          [class.disabled]="disabled()"
          [required]="isRequired()"
          [formControl]="formControl"
          (blur)="onTouched()"
        >
          <!-- Empty option -->
          <option [ngValue]="null" disabled>
            {{ emptyOptionLabel() }}
          </option>

          <!-- Options -->
          @for (option of options(); track option.key) {
            <option [ngValue]="option.key" [disabled]="option.disabled">
              {{ option.label }}
            </option>
          }

          <!-- Clear option -->
          @if (clearOptionLabel()) {
            <option [ngValue]="null">
              {{ clearOptionLabel() }}
            </option>
          }
        </select>
      </div>

      @if (loading()) {
        <div class="nmf-loading">
          <span class="nmf-spinner"></span>
        </div>
      }

      <p class="nmf-error">
        {{ errorMessage() }}
      </p>
    </div>
  `,
})
export class InputSelectComponent extends FormControlBase<any> {
  options = input<SelectOption[]>([]);
  emptyOptionLabel = input<string>('Select an option');
  clearOptionLabel = input<string | null>('Clear selection');
}
