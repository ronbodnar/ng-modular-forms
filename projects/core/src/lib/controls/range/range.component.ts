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
import { NumberBehavior } from '../../behavior/number/number.behavior';
import { formatNumber, parseNumber } from '../../number-utils';

@Component({
  selector: 'nmf-range',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./range.component.css'],
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
        class="nmf-control-wrapper frameless-control nmf-range"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
      >
        <div class="nmf-range-container" [class.ticks-enabled]="showTicks()">
          @if (value() !== null) {
            <div class="nmf-range-popup-track">
              <div
                class="nmf-range-popup-wrapper"
                [style.--range-pct]="fillPercentage()"
              >
                <div class="nmf-range-popup">
                  {{ formatValue(value()) }}
                </div>
              </div>
            </div>
          }

          <input
            #focusable
            class="nmf-control"
            type="range"
            list="ticks"
            [ngClass]="classList()"
            [style.accentColor]="'var(--nmf-input-accent-color)'"
            [id]="id()"
            [name]="name()"
            [value]="value() ?? min() ?? 0"
            [disabled]="disabled()"
            [required]="isRequired()"
            [placeholder]="translatedPlaceholder()"
            [attr.autocomplete]="autocomplete()"
            [attr.min]="min()"
            [attr.max]="max()"
            [attr.step]="step()"
            [attr.aria-label]="ariaLabel() ?? translatedLabel()"
            [attr.aria-describedby]="ariaDescribedBy()"
            [attr.aria-labelledby]="ariaLabelledBy()"
            [attr.aria-valuemin]="min() ?? 0"
            [attr.aria-valuemax]="max() ?? 100"
            [attr.aria-valuenow]="value() ?? min() ?? 0"
            [attr.aria-valuetext]="ariaValueText()"
            (blur)="onFocusOut()"
            (focus)="onFocusIn()"
            (input)="onInput($event)"
          />

          @if (showTicks()) {
            <div class="nmf-range-ticks">
              @for (marker of markerOptions(); track marker) {
                <option [value]="marker">{{ formatValue(marker) }}</option>
              }
            </div>
          }
        </div>
      </div>
    </nmf-form-field>
  `,
})
export class InputRangeComponent extends FormControlBase<number | null> {
  min = input.required<number | null>();
  max = input.required<number | null>();
  step = input<number | null>(null);
  showTicks = input<boolean>(true);
  tickCount = input<number>(2);
  formatTickValues = input<boolean>(false);

  numberBehavior = new NumberBehavior();

  fillPercentage = computed(() => {
    const minVal = this.min() ?? 0;
    const maxVal = this.max() ?? 100;
    const current = this.value() ?? minVal;

    if (maxVal <= minVal) return '0%';

    const percent = ((current - minVal) / (maxVal - minVal)) * 100;
    return `${Math.max(0, Math.min(100, percent))}%`;
  });

  markerOptions = computed(() => {
    const min = this.min() ?? 0;
    const max = this.max() ?? 100;
    const step = this.step() ?? 1;
    const ticks = this.tickCount();

    if (ticks <= 1) return [min];
    if (ticks === 2) return [min, max];

    const range = max - min;

    const raw = Array.from({ length: ticks }, (_, i) => {
      const ratio = i / (ticks - 1);
      return min + ratio * range;
    });

    const snapped = raw.map((v) => {
      const snapped = Math.round((v - min) / step) * step + min;

      return snapped;
    });

    return Array.from(new Set(snapped));
  });

  ariaValueText = computed(() => {
    const v = this.value();
    return v == null ? '' : `${v}`;
  });

  onInput(event: Event): void {
    if (this._disabledByInput()) return;

    const raw = (event.target as HTMLInputElement).value ?? '';
    const cleaned = this.numberBehavior.sanitize(raw, false);
    const parsed = parseNumber(cleaned);

    this.onChange(parsed);
  }

  formatValue(v: number | null | undefined): string {
    if (v == null) return '';

    if (!this.formatTickValues()) {
      return String(v);
    }

    return formatNumber(v) ?? '';
  }
}
