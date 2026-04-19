import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputSelectBehavior } from '@ng-modular-forms/behavior';
import { FormControlBase } from '@ng-modular-forms/core';

export interface SelectOption {
  key: string | number;
  label: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'nmf-input-select',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nmf-input-wrapper relative">
      @if (label()) {
        <label class="block font-medium mb-1">{{ label() }}</label>
      }

      <select
        class="w-full border rounded px-2 py-1"
        [disabled]="disabled"
        [value]="value ?? ''"
        (blur)="onTouched()"
        (change)="onSelectionChange(eventValue($event))"
      >
        <!-- Empty option -->
        <option [value]="''" disabled>
          {{ emptyOptionLabel() }}
        </option>

        <!-- Options -->
        @for (option of options(); track option.key) {
          <option [value]="option.key" [disabled]="option.disabled">
            {{ option.label }}
          </option>
        }

        <!-- Clear option -->
        @if (showClearOption()) {
          <option value="NONE">
            {{ 'Clear selection' }}
          </option>
        }
      </select>

      @if (control()?.invalid && control()?.touched) {
        <p class="text-red-500 text-sm mt-1">
          {{ getErrorMessage() }}
        </p>
      }
    </div>
  `,
})
export class InputSelectComponent extends FormControlBase<any> {
  options = input<SelectOption[]>([]);
  emptyOptionLabel = input<string>('forms.emptyOption');
  showClearOption = input<boolean>(false);

  behavior = new InputSelectBehavior();

  override ngOnInit() {
    super.ngOnInit();
    this.behavior.setInitialValue(this.value);
  }

  onSelectionChange(event: { value: string | number | null }) {
    this.behavior.onSelectionChange(this, event);
  }

  onSelectionClosed() {
    this.behavior.onSelectionClosed(this);
  }

  eventValue(event: Event) {
    return { value: (event.target as HTMLSelectElement).value };
  }
}
