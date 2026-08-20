import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FormControlBase } from '../../base/form-control-base';
import { NumberBehavior } from '../../behavior/number/number.behavior';
import { parseNumber, formatNumber } from '../../number-utils';
import { NmfPrefixDirective } from '../../directives/nmf-prefix.directive';
import { NmfSuffixDirective } from '../../directives/nmf-suffix.directive';

@Component({
  selector: 'nmf-number',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
  `,
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
        class="nmf-control-wrapper"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
        [class.has-prefix]="hasPrefix()"
        [class.has-suffix]="hasSuffix()"
        [style.color]="textColor()"
      >
        @if (prefix() != null) {
          <span class="nmf-prefix">
            {{ prefix() }}
          </span>
        }
        <ng-content select="[nmfPrefix]" />

        <input
          #focusable
          class="nmf-control"
          [style.color]="textColor()"
          [class.nmf-hide-stepper]="hideStepper()"
          [ngClass]="classList()"
          [id]="id()"
          [name]="name()"
          [type]="formatValue() ? 'text' : 'number'"
          [value]="displayValue()"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [required]="isRequired()"
          [placeholder]="translatedPlaceholder()"
          [attr.aria-label]="ariaLabel() ?? translatedLabel()"
          [attr.aria-describedby]="ariaDescribedBy()"
          [attr.aria-labelledby]="ariaLabelledBy()"
          [attr.autocomplete]="autocomplete()"
          [attr.min]="min()"
          [attr.max]="max()"
          [attr.step]="step()"
          (blur)="onFocusOut()"
          (focus)="onFocusIn()"
          (input)="onInput($event)"
          (keydown)="handleKeyDown($event)"
        />

        @if (suffix() != null) {
          <span class="nmf-suffix">
            {{ suffix() }}
          </span>
        }
        <ng-content select="[nmfSuffix]" />
      </div>
    </nmf-form-field>
  `,
})
export class InputNumberComponent extends FormControlBase<
  string | number | null
> {
  formatValue = input<boolean>(false);
  prefix = input<string | null>(null);
  suffix = input<string | null>(null);
  allowNegative = input<boolean>(true);
  negativeColor = input<string | null>('var(--nmf-input-error-color)');
  hideStepper = input<boolean>(false);
  min = input<number | null>(null);
  max = input<number | null>(null);
  step = input<number | null>(null);

  displayValue = signal<string>('');

  numberBehavior = new NumberBehavior();

  prefixContent = contentChild(NmfPrefixDirective);
  suffixContent = contentChild(NmfSuffixDirective);

  hasPrefix = computed(() => !!this.prefix() || !!this.prefixContent());
  hasSuffix = computed(() => !!this.suffix() || !!this.suffixContent());

  readonly textColor = computed(() => {
    const value = this.displayValue();
    if (
      value == null ||
      value === '' ||
      this.negativeColor() == null ||
      this._disabledByInput()
    ) {
      return 'inherit';
    }

    const parsed = parseNumber(value ?? 0);
    const valid = parsed != null && parsed >= 0;

    return valid ? 'inherit' : this.negativeColor();
  });

  override writeValue(value: string | number | null): void {
    super.writeValue(value);
    this.updateDisplayValue(value);
  }

  handleKeyDown(event: KeyboardEvent) {
    this.numberBehavior.blockNonDigitKey(event, this.allowNegative());
  }

  onInput(event: Event): void {
    if (this._disabledByInput()) return;

    const raw = (event.target as HTMLInputElement).value ?? '';
    const cleaned = this.numberBehavior.sanitize(raw, this.allowNegative());
    const parsed = parseNumber(cleaned);

    this.updateDisplayValue(parsed);
    this.onChange(parsed);
  }

  updateDisplayValue(value: string | number | null) {
    if (value == null) {
      this.displayValue.set('');
      return;
    }

    const parsed = typeof value === 'number' ? value : parseNumber(value);

    if (this.formatValue() && parsed != null) {
      this.displayValue.set(formatNumber(parsed) ?? '');
      return;
    }

    this.displayValue.set(String(value));
  }
}
