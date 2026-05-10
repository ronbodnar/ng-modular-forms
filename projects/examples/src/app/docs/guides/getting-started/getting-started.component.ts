import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ThemeService } from '../../../core/theme.service';
import { MatTabsModule } from '@angular/material/tabs';
import { GETTING_STARTED_STEPS } from './getting-started.steps';
import { CodeBlockComponent } from '../../shared/code-block/code-block.component';
import { DocStep } from '../../types';
import { TechIconComponent } from '../../../icons/tech-icon.component';

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [CommonModule, MatTabsModule, CodeBlockComponent, TechIconComponent],
  templateUrl: './getting-started.component.html',
})
export class GettingStartedComponent {
  private readonly themeService = inject(ThemeService);

  readonly steps = signal<DocStep[]>(GETTING_STARTED_STEPS);

  readonly stepColorClasses = computed(() => {
    const isDark = this.themeService.effectiveTheme() === 'dark';
    return {
      install: isDark ? 'bg-emerald-800' : 'bg-emerald-300',
      ui: isDark ? 'bg-amber-800' : 'bg-amber-300',
      orchestrator: isDark ? 'bg-teal-800' : 'bg-teal-300',
      handler: isDark ? 'bg-orange-800' : 'bg-orange-300',
      mapper: isDark ? 'bg-blue-800' : 'bg-blue-300',
    };
  });
}
