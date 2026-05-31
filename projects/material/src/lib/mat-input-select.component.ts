import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormControlBase } from './mat-form-control-base';
import { SelectOption } from '@ng-modular-forms/core';

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
        [formControl]="displayControl"
        (blur)="onTouched()"
        (selectionChange)="onSelectionChange($event)"
      >
        <mat-option [value]="''" [disabled]="!allowEmptyOptionSelection()">
          {{ emptyOptionLabel() }}
        </mat-option>

        <!-- All Options -->
        @for (option of options(); track option.value) {
          <mat-option [value]="option.value" [disabled]="option.disabled">
            {{ option.label }}
          </mat-option>
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
  allowEmptyOptionSelection = input<boolean>(false);
  panelWidth = input<string | number | null>('auto');

  onSelectionChange(event: MatSelectChange): void {
    if (this.disabled()) {
      return;
    }
    const value = event.value;
    this.onChange(value);
  }
}
