import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControlBase } from '@ng-modular-forms/core';
import { InputTextareaBehavior } from '@ng-modular-forms/behavior';

@Component({
  selector: 'nmf-input-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nmf-input-wrapper relative">
      @if (label()) {
        <label class="block font-medium mb-1">{{ label() }}</label>
      }

      <textarea
        class="w-full border rounded px-2 py-1"
        [id]="id"
        [rows]="rows()"
        [cols]="cols()"
        [value]="value ?? ''"
        [readonly]="readonly"
        [disabled]="disabled"
        [placeholder]="placeholder"
        (blur)="onTouched()"
        (input)="onInput($event)"
        (keydown.enter)="onEnter()"
      ></textarea>

      @if (control().invalid && control().touched) {
        <p class="text-red-500 text-sm mt-1">
          {{ getErrorMessage() }}
        </p>
      }
    </div>
  `,
})
export class InputTextareaComponent extends FormControlBase<string | null> {
  rows = input<number>(5);
  cols = input<number>(5);

  behavior = new InputTextareaBehavior();

  onEnter() {
    this.behavior.onEnter(this);
  }

  onInput(event: Event) {
    this.behavior.onInput(this, event);
  }
}
