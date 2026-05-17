import { Component, computed, input, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-copyable-terminal-text',
  imports: [MatIconModule],
  template: `
    <button
      type="button"
      title="Click to copy to clipboard"
      class="group rounded-md border border-secondary/50 bg-black/20 py-1.5 pr-4 transition hover:border-accent/40 cursor-copy"
      [attr.aria-pressed]="copied()"
      [attr.aria-label]="'Copy command: ' + command()"
      (click)="copy()"
      (mouseenter)="hovered.set(true)"
      (mouseleave)="hovered.set(false)"
    >
      <div class="flex items-center gap-2">
        <mat-icon class="text-sm! size-5! text-accent!">{{ icon() }}</mat-icon>
        <code class="text-xs lg:text-sm opacity-80"> {{ command() }}</code>
      </div>
    </button>
  `,
})
export class CopyableTerminalText {
  command = input.required<string>();

  hovered = signal(false);
  copied = signal(false);

  icon = computed(() => {
    if (this.copied()) {
      return 'check';
    }
    return this.hovered() ? 'content_copy' : 'attach_money';
  });

  async copy() {
    await navigator.clipboard.writeText(this.command());
    this.copied.set(true);
    setTimeout(() => {
      this.copied.set(false);
    }, 2000);
  }
}
