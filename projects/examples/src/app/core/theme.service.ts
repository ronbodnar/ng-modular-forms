import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type Theme = 'dark' | 'light' | 'system';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
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
    const theme = this.theme();

    if (theme === 'system') {
      return this.prefersDarkMode() ? 'dark' : 'light';
    }

    return theme;
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
      .subscribe(({ matches }) => {
        console.log('Prefers dark mode:', matches);
        this.prefersDarkMode.set(matches);
      });

    effect(() => {
      const html = document.documentElement;
      const theme =
        this.theme() === 'system'
          ? this.prefersDarkMode()
            ? 'dark'
            : 'light'
          : this.theme();

      console.log(
        'Running effect current theme:',
        this.theme(),
        'resolves to',
        theme,
      );

      if (theme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
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
