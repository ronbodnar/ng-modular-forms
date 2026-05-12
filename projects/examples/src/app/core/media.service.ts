import { computed, inject, Injectable, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private breakpointObserver = inject(BreakpointObserver);

  private _isMobile = signal(false);

  readonly isMobile = this._isMobile.asReadonly();

  readonly isDesktop = computed(() => !this._isMobile());

  constructor() {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((state) => {
        this._isMobile.set(state.matches);
      });
  }
}
