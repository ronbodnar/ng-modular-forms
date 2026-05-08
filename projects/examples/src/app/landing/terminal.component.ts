import { Component, input } from '@angular/core';

@Component({
  selector: 'app-copyable-terminal-text',
  template: `
    <button
      (click)="copy()"
      class="group rounded-lg border border-secondary/10 bg-black/20 p-1 pr-4 transition hover:border-accent/40"
    >
      <div class="flex items-center gap-3">
        <span
          class="bg-secondary/10 px-3 py-1.5 text-accent rounded-md text-xs font-mono"
          >$</span
        >
        <code class="text-sm opacity-80"> {{ command() }}</code>
      </div>
    </button>
  `,
})
export class CopyableTerminalText {
  command = input.required<string>();

  async copy() {
    await navigator.clipboard.writeText(this.command());
  }
}
