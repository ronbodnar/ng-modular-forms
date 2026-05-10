import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ThemeService } from './core/theme.service';
import { CommonModule } from '@angular/common';
import { TechIconComponent } from './icons/tech-icon.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TechIconComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private themeService = inject(ThemeService);

  navigationLinks = [
    { label: 'Getting Started', path: '/docs/guides/getting-started' },
    { label: 'Examples', path: '/docs/examples' },
  ];

  readonly nextThemeIcon = computed(() => {
    switch (this.themeService.nextTheme()) {
      case 'light':
        return 'light_mode';

      case 'dark':
        return 'dark_mode';

      default:
        return 'brightness_auto';
    }
  });

  readonly nextThemeLabel = computed(() => {
    switch (this.themeService.nextTheme()) {
      case 'dark':
        return 'Dark mode';

      case 'light':
        return 'Light mode';

      default:
        return 'System theme';
    }
  });

  setNextTheme() {
    this.themeService.setNextTheme();
  }
}
