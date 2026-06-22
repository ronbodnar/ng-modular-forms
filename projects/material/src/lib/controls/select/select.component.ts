import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormControlBase } from '../../base/mat-form-control-base';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        flex-basis: 160px; /* Default baseline  */
        flex-shrink: 1; /* Allows size changes by the parent */
      }
    `,
  ],
  template: `
    @if (translatedLabel() && detachLabel()) {
      <label class="nmf-mat-label-detached">{{ translatedLabel() }}</label>
    }

    <mat-form-field
      class="nmf-mat-field"
      [appearance]="appearance()"
      [floatLabel]="shouldLabelFloat()"
    >
      @if (translatedLabel() && !detachLabel()) {
        <mat-label>{{ translatedLabel() }}</mat-label>
      }

      <mat-select
        #focusable
        [class.hide-select-arrow]="loading()"
        [id]="id()"
        [panelWidth]="panelWidth()"
        [required]="isRequired()"
        [placeholder]="translatedEmptyOptionLabel()"
        [formControl]="displayControl"
        (blur)="onFocusOut()"
        (focus)="onFocusIn()"
        (selectionChange)="onSelectionChange($event)"
      >
        <mat-option [value]="''" [disabled]="!allowEmptyOptionSelection()">
          {{ translatedEmptyOptionLabel() }}
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
        <mat-hint [ngClass]="hintClassList()">{{ translatedHint() }}</mat-hint>
      }

      <mat-error>{{ translatedErrorMessage() }}</mat-error>
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

  readonly translatedEmptyOptionLabel = computed(() =>
    this.translate(this.emptyOptionLabel()),
  );

  onSelectionChange(event: MatSelectChange): void {
    if (this.disabled()) {
      return;
    }
    const value = event.value;
    this.onChange(value);
  }
}
