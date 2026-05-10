import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HighlightLoader } from 'ngx-highlightjs';

export type Theme = 'dark' | 'light' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private hljsLoader = inject(HighlightLoader);
  private breakpointObserver = inject(BreakpointObserver);

  private readonly _theme = signal<Theme>(
    (localStorage.getItem('theme') as Theme) || 'system',
  );

  private readonly prefersDarkMode = signal(false);

  private readonly prefersDarkObserver$ = this.breakpointObserver.observe(
    '(prefers-color-scheme: dark)',
  );

  readonly theme = this._theme.asReadonly();

  readonly effectiveTheme = computed(() => {
    if (this.theme() === 'system') {
      return this.prefersDarkMode() ? 'dark' : 'light';
    }
    return this.theme();
  });

  public readonly nextTheme = computed(() => {
    const currentTheme = this.theme();
    switch (currentTheme) {
      case 'dark':
        return 'light';

      case 'light':
        return 'system';

      default:
        return 'dark';
    }
  });

  constructor() {
    this.prefersDarkObserver$
      .pipe(takeUntilDestroyed())
      .subscribe(({ matches }) => this.prefersDarkMode.set(matches));

    effect(() => {
      const theme = this.effectiveTheme();

      document.documentElement.classList.toggle('dark', theme === 'dark');

      this.hljsLoader.setTheme(
        theme === 'dark'
          ? 'assets/highlightjs/stackoverflow-dark.css'
          : 'assets/highlightjs/stackoverflow-light.css',
      );
    });
  }

  public setNextTheme() {
    this._theme.set(this.nextTheme());
    localStorage.setItem('theme', this.theme());
  }

  public setTheme(theme: Theme) {
    this._theme.set(theme);
  }
}
