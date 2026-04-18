import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControlBase } from '@ng-modular-forms/core';

@Component({
  selector: 'nmf-input-datepicker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nmf-input-wrapper relative">
      @if (label()) {
        <label class="block font-medium mb-1">{{ label() }}</label>
      }

      <div class="relative">
        @if (loading()) {
          <div class="absolute right-2 top-2 text-sm opacity-60">
            Loading...
          </div>
        }

        <input
          type="date"
          autocomplete="off"
          [id]="id"
          [name]="name"
          [value]="formatDate(value)"
          [min]="formatDate(minDate())"
          [max]="formatDate(maxDate())"
          [disabled]="disabled"
          [readonly]="readonly"
          [ngClass]="classList().concat(readonly ? ['opacity-60'] : [])"
          [placeholder]="placeholder || ''"
          (input)="onInput($event)"
          (blur)="onTouched()"
          class="w-full border rounded px-2 py-1"
        />
      </div>

      <ng-content></ng-content>

      @if (control().invalid && control().touched) {
        <p class="text-red-500 text-sm mt-1">
          {{ getErrorMessage() }}
        </p>
      }
    </div>
  `,
})
export class InputDatepickerComponent extends FormControlBase<Date | null> {
  minDate = input<Date | null>(null);
  maxDate = input<Date | null>(null);

  formatDate(date: Date | null | undefined): string | null {
    if (!date) return null;

    // yyyy-MM-dd (required by input[type="date"])
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  parseDate(value: string): Date | null {
    if (!value) return null;
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const parsed = this.parseDate(input.value);

    this.value = parsed;
    this.onChange(this.value);
  }
}
