import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavComponent } from '../top-nav/top-nav.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MediaService } from '../../core/media.service';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

@Component({
  selector: 'app-app-shell-content',
  imports: [CommonModule, MatSidenavModule, TopNavComponent, SideNavComponent],
  templateUrl: './app-shell.component.html',
})
export class AppShellComponent {
  private readonly router = inject(Router);
  private readonly mediaService = inject(MediaService);

  readonly isMobile = this.mediaService.isMobile;

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  readonly showDocsNav = computed(() => this.currentUrl().startsWith('/docs'));

  onSidenavOpenedChange(opened: boolean) {
    document.body.style.overflow = opened ? 'hidden' : '';
  }
}
