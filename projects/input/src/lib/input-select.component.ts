import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
        [disabled]="disabled || loading()"
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
        @if (clearOptionLabel()) {
          <option value="NONE">
            {{ clearOptionLabel() }}
          </option>
        }
      </select>

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
export class InputSelectComponent
  extends InputFormControlBase<any>
  implements OnInit
{
  options = input<SelectOption[]>([]);
  emptyOptionLabel = input<string>('Select an option');
  clearOptionLabel = input<string | null>('Clear selection');

  private _initialValue = signal<any>(null);

  override ngOnInit() {
    super.ngOnInit();
    this._initialValue.set(this.value);
  }

  onSelectionChange(event: { value: string | number | null }) {
    if (this.disabled) return;

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
