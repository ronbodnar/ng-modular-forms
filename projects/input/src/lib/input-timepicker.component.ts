import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputFormControlBase } from './input-form-control-base';

@Component({
  selector: 'nmf-timepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./input-styles.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nmf-field">
      @if (label()) {
        <label class="nmf-label">
          {{ label() }}
          @if (required) {
            <span class="nmf-required">*</span>
          }
        </label>
      }

      <input
        type="time"
        autocomplete="off"
        class="nmf-input"
        [class.error]="errorState"
        [class.readonly]="readonly"
        [id]="id"
        [name]="name"
        [value]="formatTime(value)"
        [ngClass]="classList()"
        [step]="step()"
        [disabled]="disabled || loading()"
        [required]="required"
        [readonly]="readonly"
        [placeholder]="placeholder"
        (input)="onInput($event)"
        (blur)="onTouched()"
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
export class InputTimepickerComponent extends InputFormControlBase<Date | null> {
  // step in seconds: 60 = minutes only, 1 = show seconds
  step = input<number>(60);

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

  onInput(event: Event): void {
    if (this.disabled) return;

    const input = event.target as HTMLInputElement;
    const parsed = this.parseTime(input.value);

    this.value = parsed;
    this.onChange(parsed);
  }
}
