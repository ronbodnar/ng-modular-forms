import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlBase } from '@ng-modular-forms/core';

@Component({
  selector: 'nmf-timepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./input-styles.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nmf-field" [class.loading]="loading()">
      @if (label()) {
        <label class="nmf-label">
          {{ label() }}
          @if (isRequired()) {
            <span class="nmf-required">*</span>
          }
        </label>
      }

      <input
        type="time"
        autocomplete="off"
        class="nmf-input"
        [ngClass]="classList()"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
        [id]="id()"
        [name]="name()"
        [step]="step()"
        [value]="displayValue()"
        [disabled]="disabled()"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        (blur)="onTouched()"
        (input)="onInput($event)"
      />

      <ng-content></ng-content>

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
