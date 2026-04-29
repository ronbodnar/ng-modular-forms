import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputFormControlBase } from './input-form-control-base';

@Component({
  selector: 'nmf-textarea',
  standalone: true,
  styleUrls: ['./input-styles.css'],
  imports: [CommonModule, ReactiveFormsModule],
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

      <textarea
        class="nmf-input"
        [id]="id"
        [rows]="rows()"
        [cols]="cols()"
        [ngClass]="classList()"
        [value]="value"
        [class.error]="errorState"
        [class.readonly]="readonly"
        [readonly]="readonly"
        [required]="required"
        [disabled]="disabled"
        [placeholder]="placeholder"
        (blur)="onTouched()"
        (input)="onInput($event)"
      ></textarea>

      <p class="nmf-error">
        {{ errorMessage() }}
      </p>

      @if (loading()) {
        <div class="nmf-loading">
          <span class="nmf-spinner"></span>
        </div>
      }
    </div>
  `,
})
export class InputTextareaComponent extends InputFormControlBase<
  string | null
> {
  rows = input<number>(5);
  cols = input<number>(5);

  onInput(event: Event) {
    if (this.disabled) return;

    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }
}
