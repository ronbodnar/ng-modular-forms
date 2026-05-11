import { CommonModule } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';
import { Highlight, HighlightLoader } from 'ngx-highlightjs';
import { ThemeService } from '../../../core/theme.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-code-block',
  imports: [CommonModule, Highlight, MatIconModule],
  templateUrl: './code-block.component.html',
})
export class CodeBlockComponent {
  id = input.required<string>();
  code = input.required<string>();
  language = input<string>('typescript');
  classList = input<string>('');

  loadingCode = signal(true);

  constructor(
    private hljsLoader: HighlightLoader,
    private themeService: ThemeService,
  ) {
    effect(() => {
      const theme = this.themeService.effectiveTheme();

      this.hljsLoader.setTheme(
        theme === 'dark'
          ? 'assets/highlightjs/stackoverflow-dark.css'
          : 'assets/highlightjs/stackoverflow-light.css',
      );
    });
  }

  readonly copied = signal<Record<string, boolean>>({});

  onCodeReady(code: any) {
    if (code !== null) {
      this.loadingCode.set(false);
    }
  }

  copyCode(id: string, code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.copied.update((s) => ({ ...s, [id]: true }));

      setTimeout(() => {
        this.copied.update((s) => ({ ...s, [id]: false }));
      }, 2000);
    });
  }

  isCopied(id: string): boolean {
    return this.copied()[id] ?? false;
  }
}
