import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormControlBase } from '../../base/mat-form-control-base';
import { MatButtonModule } from '@angular/material/button';
import { FormFieldComponent } from '@ng-modular-forms/core';

type RangeValue = [number, number] | number | null;

@Component({
  selector: 'nmf-mat-range',
  imports: [
    CommonModule,
    FormFieldComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSliderModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      mat-slider {
        width: 100%;
      }

      .error {
        --nmf-input-error-color: var(--mat-sys-error);
      }
    `,
  ],
  template: `
    <nmf-form-field
      [label]="translatedLabel()"
      [isRequired]="isRequired()"
      [loading]="loading()"
      [errorMessage]="translatedErrorMessage()"
      [hintLabel]="translatedHintLabel()"
      [hintClassList]="hintClassList()"
    >
      <mat-slider
        [min]="min() ?? 0"
        [max]="max() ?? 100"
        [step]="step() ?? 1"
        [discrete]="discrete()"
        [showTickMarks]="showTickMarks()"
        [attr.aria-label]="ariaLabel() ?? translatedLabel()"
        [attr.aria-describedby]="ariaDescribedBy()"
      >
        @if (rangeSelection()) {
          <input
            matSliderStartThumb
            [value]="startValue ?? min() ?? 0"
            (valueChange)="onRangeStartChange($event)"
          />
          <input
            matSliderEndThumb
            [value]="endValue ?? max() ?? 100"
            (valueChange)="onRangeEndChange($event)"
          />
        } @else {
          <input
            matSliderThumb
            [value]="value()"
            (valueChange)="onSingleChange($event)"
          />
        }
      </mat-slider>
    </nmf-form-field>
  `,
})
export class MatInputRangeComponent extends MatFormControlBase<RangeValue> {
  min = input<number | null>(null);
  max = input<number | null>(null);
  step = input<number | null>(null);

  rangeSelection = input<boolean>(false);
  showTickMarks = input<boolean>(false);

  discrete = input<boolean>(true);

  startValue: number | null = null;
  endValue: number | null = null;

  onSingleChange(value: number): void {
    this.onChange(value);
    this.onTouched();
  }

  onRangeStartChange(value: number): void {
    this.startValue = value;
    this.emitRangeIfReady();
  }

  onRangeEndChange(value: number): void {
    this.endValue = value;
    this.emitRangeIfReady();
  }

  private emitRangeIfReady(): void {
    if (this.startValue == null || this.endValue == null) return;

    const start = Math.min(this.startValue, this.endValue);
    const end = Math.max(this.startValue, this.endValue);

    this.onChange([start, end]);
    this.onTouched();
  }

  override writeValue(value: RangeValue): void {
    super.writeValue(value);

    if (Array.isArray(value)) {
      this.startValue = value[0];
      this.endValue = value[1];
    } else if (typeof value === 'number') {
      this.startValue = value;
      this.endValue = null;
    } else {
      this.startValue = null;
      this.endValue = null;
    }
  }
}
