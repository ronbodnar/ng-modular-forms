import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';

@Component({
  selector: 'app-code-block',
  imports: [CommonModule, Highlight],
  templateUrl: './code-block.component.html',
})
export class CodeBlockComponent {
  id = input.required<string>();
  code = input.required<string>();
  language = input<string>('typescript');
  classList = input<string>('');

  loadingCode = signal(true);

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
