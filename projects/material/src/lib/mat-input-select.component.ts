import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormControlBase } from './mat-form-control-base';

export interface SelectOption {
  key: string | number;
  label: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'nmf-mat-select',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  styleUrls: ['./mat-input-styles.css'],
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

      <mat-select
        [value]="value"
        [panelWidth]="panelWidth()"
        [class.hide-select-arrow]="loading()"
        [disabled]="_disabled()"
        (blur)="onTouched()"
        (selectionChange)="onSelectionChange($event)"
        (closed)="onSelectionClosed()"
      >
        <mat-option [value]="value === -1 ? -1 : ''" selected disabled>
          {{ emptyOptionLabel() }}
        </mat-option>

        <!-- All Options -->
        @for (option of options(); track option.label) {
          <mat-option [value]="option.key" [disabled]="option.disabled">
            {{ option.label }}
          </mat-option>
        }

        <!-- Clear Selection Option -->
        @if (clearOptionLabel()) {
          <mat-option value="NONE">{{ clearOptionLabel() }}</mat-option>
        }
      </mat-select>

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

      <mat-error>{{ getErrorMessage() }}</mat-error>
    </mat-form-field>
  `,
})
export class MatInputSelectComponent extends MatFormControlBase<
  string | number | null
> {
  options = input<SelectOption[]>([]);
  emptyOptionLabel = input<string>('Select an option');
  clearOptionLabel = input<string | null>('Clear selection');
  panelWidth = input<string | number | null>('auto');

  private _initialValue = signal<any>(null);

  override ngOnInit() {
    super.ngOnInit();
    this._initialValue.set(this.value);
  }

  onSelectionChange(event: MatSelectChange): void {
    let value = event.value;
    if (value === 'NONE') {
      value = typeof this._initialValue() === 'number' ? -1 : '';
    } else {
      value = event.value;
    }

    this.value = value;
    this.onChange(value);
  }

  onSelectionClosed(): void {
    if (this.value === '') {
      this.ngControl.control?.markAsDirty();
    }
  }
}
