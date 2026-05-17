import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SIDE_NAV_ITEMS } from './side-nav.items';
import { MediaService } from '../../core/media.service';
import { ToggleThemeComponent } from '../ui/toggle-theme/toggle-theme.component';
import { SocialLinksComponent } from '../ui/social-links/social-links.component';
import type { MatSidenav } from '@angular/material/sidenav';
import type { NavItem } from './side-nav.types';

@Component({
  selector: 'app-side-nav',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    ToggleThemeComponent,
    SocialLinksComponent,
    RouterLink,
    RouterLinkActive,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './side-nav.component.html',
})
export class SideNavComponent {
  readonly router = inject(Router);
  readonly mediaService = inject(MediaService);

  navigated = output<void>();

  @ViewChild('snav') snav!: MatSidenav;

  navItems = SIDE_NAV_ITEMS;

  readonly isMobile = this.mediaService.isMobile;

  private expandedSections = signal<string[]>(['guides', 'examples']);

  toggleSection(section: string) {
    this.expandedSections.update((current) =>
      current.includes(section)
        ? current.filter((s) => s !== section)
        : current.map((s) => s).concat(section),
    );
  }

  onNavigationClick(navItem: NavItem, childIdxClicked?: number) {
    const { children, route, sectionName } = navItem;
    const hasChildren = children?.length;

    if (hasChildren && childIdxClicked === undefined) {
      this.toggleSection(sectionName);
      return;
    }

    if (!hasChildren && route && childIdxClicked === undefined) {
      if (route.startsWith('.')) {
        window.open(document.location.origin + route.slice(1), '_blank');
      } else {
        this.router.navigateByUrl(route);
      }
      return;
    }

    if (this.isMobile()) {
      this.navigated.emit();
    }
  }

  isOpen(section: string): boolean {
    return this.expandedSections().includes(section);
  }
}
