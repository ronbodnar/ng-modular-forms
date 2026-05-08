import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-feature',
  template: `
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">{{ title() }}</h3>
      <p class="text-sm leading-relaxed opacity-60">
        <ng-content></ng-content>
      </p>
    </div>
  `,
})
export class FeatureComponent {
  title = input.required<string>();
}
