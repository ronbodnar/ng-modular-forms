import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ThemeService } from '../../../core/theme.service';
import { MatTabsModule } from '@angular/material/tabs';
import { GETTING_STARTED_STEPS } from './getting-started.steps';
import { TechIconComponent } from '../../../icons/tech-icon.component';
import { CodeBlockComponent } from '../../ui/code-block/code-block.component';
import { DocsPageComponent } from '../../ui/docs-page/docs-page.component';
import type { DocStep } from '../../docs.types';

@Component({
  selector: 'app-getting-started',
  imports: [
    CommonModule,
    MatTabsModule,
    CodeBlockComponent,
    TechIconComponent,
    DocsPageComponent,
  ],
  templateUrl: './getting-started.component.html',
})
export class GettingStartedComponent {
  private readonly themeService = inject(ThemeService);

  readonly steps = signal<DocStep[]>(GETTING_STARTED_STEPS);

  readonly stepColorClasses = computed(() => {
    const isDark = this.themeService.effectiveTheme() === 'dark';
    return {
      install: isDark ? 'bg-emerald-800' : 'bg-emerald-300',
      styles: isDark ? 'bg-indigo-800' : 'bg-indigo-300',
      ui: isDark ? 'bg-amber-800' : 'bg-amber-300',
      orchestrator: isDark ? 'bg-teal-800' : 'bg-teal-300',
      handler: isDark ? 'bg-orange-800' : 'bg-orange-300',
      mapper: isDark ? 'bg-blue-800' : 'bg-blue-300',
    };
  });
}
