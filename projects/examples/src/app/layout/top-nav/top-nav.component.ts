import { Component, inject, output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MediaService } from '../../core/media.service';
import { CommonModule } from '@angular/common';
import { ToggleThemeComponent } from '../ui/toggle-theme/toggle-theme.component';
import { SocialLinksComponent } from '../ui/social-links/social-links.component';

@Component({
  selector: 'app-top-nav',
  imports: [
    CommonModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    RouterLink,
    MatDividerModule,
    MatSlideToggleModule,
    ToggleThemeComponent,
    SocialLinksComponent,
  ],
  templateUrl: './top-nav.component.html',
})
export class TopNavComponent {
  navToggled = output<void>();

  private readonly mediaService = inject(MediaService);

  readonly isMobile = this.mediaService.isMobile;

  readonly navItems = [
    {
      label: 'Getting Started',
      path: 'docs/guides/getting-started',
    },
    {
      label: 'Examples',
      path: 'docs/examples',
    },
  ];
}
