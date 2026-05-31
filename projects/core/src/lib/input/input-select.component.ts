import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControlBase } from '../base/form-control-base';
import { FormFieldComponent } from './form-field.component';

export interface SelectOption {
  value: string | number;
  label: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'nmf-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nmf-form-field
      [label]="label()"
      [isRequired]="isRequired()"
      [loading]="loading()"
      [errorMessage]="errorMessage()"
    >
      <div class="select-wrapper" [class.disabled]="disabled()">
        <select
          class="nmf-input"
          [id]="id"
          [ngClass]="classList()"
          [class.error]="hasErrors()"
          [class.disabled]="disabled()"
          [value]="value ?? ''"
          [disabled]="disabled()"
          [required]="isRequired()"
          (blur)="onTouched()"
          (change)="handleChange($event)"
        >
          <!-- Empty option -->
          <option [value]="''" [disabled]="!allowEmptyOptionSelection()">
            {{ emptyOptionLabel() }}
          </option>

          <!-- Options -->
          @for (option of options(); track option.value) {
            <option [value]="option.value" [disabled]="option.disabled">
              {{ option.label }}
            </option>
          }
        </select>
      </div>
    </nmf-form-field>
  `,
})
export class InputSelectComponent extends FormControlBase<
  string | number | null
> {
  options = input<SelectOption[]>([]);
  emptyOptionLabel = input<string>('Select an option');
  allowEmptyOptionSelection = input<boolean>(false);

  handleChange(event: Event): void {
    if (this._disabledByCva()) return;

    const input = event.target as HTMLSelectElement;
    this.onChange(input.value || null);
  }
}
