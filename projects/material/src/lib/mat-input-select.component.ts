import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
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
        [class.hide-select-arrow]="loading()"
        [panelWidth]="panelWidth()"
        [required]="isRequired()"
        [placeholder]="emptyOptionLabel()"
        [formControl]="control"
        (blur)="onTouched()"
      >
        <mat-option [value]="null" disabled>
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
          <mat-option [value]="null">{{ clearOptionLabel() }}</mat-option>
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

      <mat-error>{{ errorMessage() }}</mat-error>
    </mat-form-field>
  `,
})
export class MatInputSelectComponent
  extends MatFormControlBase<string | number | null>
  implements OnInit
{
  options = input<SelectOption[]>([]);
  emptyOptionLabel = input<string>('Select an option');
  clearOptionLabel = input<string | null>('Clear selection');
  panelWidth = input<string | number | null>('auto');
}
