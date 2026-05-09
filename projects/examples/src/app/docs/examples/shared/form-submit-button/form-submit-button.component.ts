import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-form-submit-button',
  imports: [MatProgressSpinner, MatProgressBarModule, MatButtonModule],
  template: `
    <button
      type="submit"
      mat-raised-button
      class="bg-accent! text-neutral-200!"
      [disabled]="loading()"
    >
      <span
        class="transition-opacity duration-150"
        [class.opacity-0]="loading()"
      >
        {{ label() }}
      </span>

      @if (loading()) {
        <div
          class="absolute top-0 left-0 w-full h-full flex items-center justify-center"
        >
          <mat-spinner
            class="white-spinner m-auto"
            diameter="16"
            strokeWidth="2"
          ></mat-spinner>
        </div>
      }
    </button>
  `,
})
export class FormSubmitButtonComponent {
  label = input<string>('Submit');
  loading = input<boolean>(false);
}
