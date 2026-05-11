import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-section',
  template: `
    <div class="bg-tertiary rounded p-4 shadow-sm flex flex-col gap-4">
      <h2 class="text-lg mt-0 mb-2 font-medium border-b-accent border-b-2">
        {{ title() }}
      </h2>

      <ng-content></ng-content>
    </div>
  `,
})
export class FormSectionComponent {
  title = input<string>();
}
