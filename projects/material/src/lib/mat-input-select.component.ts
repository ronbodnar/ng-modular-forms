import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatFormControlBase } from './mat-form-control-base';
import { InputSelectBehavior } from '@ng-modular-forms/behavior';

export interface SelectOption {
  key: string | number;
  label: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'nmf-mat-input-select',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label() && detachLabel()) {
      <label class="font-medium text-base">{{ label() }}</label>
    }
    <mat-form-field
      appearance="outline"
      [floatLabel]="shouldLabelFloat ? 'always' : 'auto'"
    >
      @if (label() && !detachLabel()) {
        <mat-label>{{ label() }}</mat-label>
      }

      <mat-select
        [value]="value"
        [disabled]="disabled"
        [panelWidth]="panelWidth()"
        [ngClass]="disabled ? 'hide-arrow' : ''"
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
        @if (showClearOption()) {
          <mat-option value="NONE">{{ 'forms.clearSelection' }}</mat-option>
        }
      </mat-select>

      @if (loading()) {
        <div class="absolute top-2 right-2">
          <mat-spinner diameter="24" strokeWidth="3"></mat-spinner>
        </div>
      }

      @if (hint()) {
        <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
      }

      @if (control()?.invalid && control()?.touched) {
        <mat-error>{{ getErrorMessage() }}</mat-error>
      }
    </mat-form-field>
  `,
})
export class MatInputSelectComponent extends MatFormControlBase<
  string | number | null
> {
  options = input<SelectOption[]>([]);
  emptyOptionLabel = input<string>('forms.emptyOption');
  showClearOption = input<boolean>(false);
  panelWidth = input<string | number | null>('auto');

  behavior = new InputSelectBehavior();

  onSelectionClosed(): void {
    this.behavior.onSelectionClosed(this);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.behavior.setInitialValue(this.value);
  }

  onSelectionChange(event: MatSelectChange): void {
    this.behavior.onSelectionChange(this, event);
  }
}
