import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-docs-page',
  imports: [CommonModule],
  template: `
    <div class="px-5 lg:px-10 pt-4 flex flex-col">
      <h1 class="text-2xl font-semibold my-0">{{ title() }}</h1>

      <div
        class="flex flex-col gap-4 mt-4 pt-4 border-t-2 border-t-tertiary flex-1"
        [ngClass]="bodyClass()"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class DocsPageComponent {
  title = input<string>();
  bodyClass = input<string>('');
}
