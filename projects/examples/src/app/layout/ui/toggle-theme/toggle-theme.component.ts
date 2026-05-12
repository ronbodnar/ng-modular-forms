import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../../../core/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toggle-theme',
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatButtonModule],
  templateUrl: './toggle-theme.component.html',
})
export class ToggleThemeComponent {
  private readonly themeService = inject(ThemeService);

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
