import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-form-example',
  template: `
    <div class="flex flex-col h-full items-start">
      <h1 class="text-2xl font-semibold my-0">
        {{ title() }}
      </h1>

      <div
        class="flex flex-col gap-4 mt-4 border-t-2 border-t-tertiary flex-1 min-h-0 overflow-y-auto p-4 self-stretch"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class FormExampleComponent {
  title = input<string>();
  description = input<string>();
  sourceUrl = input<string>();

  active = signal<'preview' | 'html' | 'ts'>('preview');
}
