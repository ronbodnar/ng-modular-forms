import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormStatus } from '@ng-modular-forms/core';
import { FormSectionComponent } from '../form-section/form-section.component';

@Component({
  selector: 'app-form-status-output',
  imports: [JsonPipe, FormSectionComponent],
  template: `
    <app-form-section title="Form Output">
      @if (status()) {
        <p class="my-0 text-sm">
          Status: <span class="font-medium">{{ status() }}</span>
        </p>
      }

      @if (errorMessage()) {
        <p class="text-sm text-red-700">Error: {{ errorMessage() }}</p>
      }

      @if (output()) {
        <div class="text-sm">
          <span>Value:</span>
          <pre
            class="whitespace-pre-wrap font-mono text-sm bg-secondary rounded p-2.5 shadow-sm mt-1"
            >{{ output() | json }}</pre
          >
        </div>
      }
    </app-form-section>
  `,
})
export class FormStatusOutputComponent {
  status = input<FormStatus | null>(null);
  errorMessage = input<string | null>(null);
  output = input<{ [key: string]: any } | null>(null);
}
