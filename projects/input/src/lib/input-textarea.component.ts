import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControlBase } from '@ng-modular-forms/core';

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
          @if (isRequired()) {
            <span class="nmf-required">*</span>
          }
        </label>
      }

      <textarea
        class="nmf-input"
        [ngClass]="classList()"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
        [id]="id()"
        [rows]="rows()"
        [cols]="cols()"
        [required]="isRequired()"
        [placeholder]="placeholder()"
        [formControl]="control"
        (blur)="onTouched()"
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
export class InputTextareaComponent extends FormControlBase<string | null> {
  rows = input<number>(5);
  cols = input<number>(5);
}
