import {
  ChangeDetectionStrategy,
  Component,
  input,
  Optional,
  Self,
  signal,
} from '@angular/core';
import { NgControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputFormControlBase } from './input-form-control-base';

export interface SelectOption {
  key: string | number;
  label: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'nmf-select',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./input-styles.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nmf-field">
      @if (label()) {
        <label class="nmf-label">
          {{ label() }}
          @if (required) {
            <span class="nmf-required">*</span>
          }
        </label>
      }

      <select
        class="nmf-input"
        [class.error]="errorState"
        [class.readonly]="readonly"
        [ngClass]="classList()"
        [value]="value"
        [disabled]="disabled"
        [required]="required"
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

      <p class="nmf-error">
        {{ getErrorMessage() }}
      </p>
    </div>
  `,
})
export class InputSelectComponent extends InputFormControlBase<any> {
  options = input<SelectOption[]>([]);
  emptyOptionLabel = input<string>('Select an option');
  showClearOption = input<boolean>(false);

  private _initialValue = signal<any>(null);

  constructor(@Optional() @Self() ngControl: NgControl) {
    super();
    if (ngControl) {
      ngControl.valueAccessor = this;
    }
  }

  override ngOnInit() {
    super.ngOnInit();
    this._initialValue.set(this.value);
  }

  onSelectionChange(event: { value: string | number | null }) {
    let value = event.value;
    if (value === 'NONE') {
      value = typeof this._initialValue() === 'number' ? -1 : '';
    } else {
      value = event.value;
    }

    if (value != null) {
      this.onChange(value);
    }
  }

  onSelectionClosed(): void {
    if (this.value === '' || this.value === -1) {
      this.ngControl?.control?.markAsDirty();
    }
  }

  eventValue(event: Event) {
    return { value: (event.target as HTMLSelectElement).value };
  }
}
