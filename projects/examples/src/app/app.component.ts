import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ThemeService } from './core/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private themeService = inject(ThemeService);

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
