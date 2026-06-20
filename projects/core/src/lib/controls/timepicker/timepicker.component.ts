import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FormControlBase } from '../../base/form-control-base';

@Component({
  selector: 'nmf-timepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nmf-form-field
      [label]="translatedLabel()"
      [isRequired]="isRequired()"
      [loading]="loading()"
      [errorMessage]="translatedErrorMessage()"
      [hint]="translatedHint()"
      [hintClassList]="hintClassList()"
    >
      <div
        class="nmf-control-wrapper"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
      >
        <input
          #focusable
          type="time"
          class="nmf-control"
          [ngClass]="classList()"
          [id]="id()"
          [name]="name()"
          [step]="step()"
          [value]="displayValue()"
          [disabled]="disabled()"
          [required]="isRequired()"
          [placeholder]="translatedPlaceholder()"
          [autocomplete]="autocompleteAttr()"
          (blur)="onTouched()"
          (input)="onInput($event)"
        />
      </div>
    </nmf-form-field>
  `,
})
export class InputTimepickerComponent extends FormControlBase<Date | null> {
  // step in seconds: 60 = minutes only, 1 = show seconds
  step = input<number>(60);
  displayValue = signal<string>('');

  formatTime(date: Date | null | undefined): string | null {
    if (!date) return null;

    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return this.step() < 60 ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
  }

  parseTime(value: string): Date | null {
    if (!value) return null;

    const [h, m, s = 0] = value.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, s, 0);
    return date;
  }

  override writeValue(value: Date | null): void {
    super.writeValue(value);
    this.displayValue.set(this.formatTime(value) ?? '');
  }

  onInput(event: Event): void {
    if (this._disabledByInput()) return;

    const input = event.target as HTMLInputElement;
    const parsed = this.parseTime(input.value);

    this.displayValue.set(this.formatTime(parsed) ?? '');

    this.onChange(parsed);
  }
}
