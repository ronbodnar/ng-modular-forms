import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'nmf-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

      <ng-content></ng-content>

      @if (loading()) {
        <div class="nmf-loading">
          <span class="nmf-spinner"></span>
        </div>
      }

      @if (hint()) {
        <p class="nmf-hint">
          {{ hint() }}
        </p>
      }

      <p class="nmf-hint" [class.error]="hasErrors()">
        {{ errorMessage() }}
      </p>
    </div>
  `,
})
export class FormFieldComponent {
  label = input<string>();
  isRequired = input<boolean>();
  loading = input<boolean>();
  hint = input<string | null>();
  errorMessage = input<string | null>();

  hasErrors = computed(() => this.errorMessage() != null);
}
