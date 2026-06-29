import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FormControlBase } from '../../base/form-control-base';

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
      [label]="translatedLabel()"
      [isRequired]="isRequired()"
      [loading]="loading()"
      [errorMessage]="translatedErrorMessage()"
      [hintLabel]="translatedHintLabel()"
      [hintClassList]="hintClassList()"
    >
      <div
        class="nmf-control-wrapper nmf-select"
        [class.disabled]="disabled()"
        [class.error]="hasErrors()"
      >
        <select
          #focusable
          class="nmf-control"
          [ngClass]="classList()"
          [id]="id()"
          [value]="value() ?? ''"
          [disabled]="disabled()"
          [required]="isRequired()"
          [autocomplete]="autocompleteAttr()"
          (blur)="onFocusOut()"
          (focus)="onFocusIn()"
          (change)="handleChange($event)"
        >
          <!-- Empty option -->
          <option [value]="''" [disabled]="!allowEmptyOptionSelection()">
            {{ translatedEmptyOptionLabel() }}
          </option>

          <!-- Options -->
          @for (option of translatedOptions(); track option.value) {
            <option
              [value]="option.value"
              [disabled]="option.disabled"
              [selected]="option.value === value()"
            >
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

  translatedOptions = computed(() =>
    this.options().map((option) => ({
      ...option,
      label: this.translate(String(option.label)),
    })),
  );

  readonly translatedEmptyOptionLabel = computed(() =>
    this.translate(this.emptyOptionLabel()),
  );

  handleChange(event: Event): void {
    if (this._disabledByCva()) return;

    const input = event.target as HTMLSelectElement;
    this.onChange(input.value || null);
  }
}
