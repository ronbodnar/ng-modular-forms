import { FormControlBase } from '@ng-modular-forms/core';

export class InputCurrencyBehavior {
  onInput(ctx: FormControlBase<string | null>, event: Event) {
    const rawValue = (event.target as HTMLInputElement).value ?? '';
    const value = this.formatCurrency(rawValue);
    ctx.value = value;
    ctx.onChange(value);
  }

  handleKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Tab',
      'Backspace',
      'Delete',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      ',',
      '.',
    ];
    if (
      !allowedKeys.includes(event.key) &&
      !(Number(event.key) >= 0 && Number(event.key) <= 9) &&
      !(
        event.key === '-' &&
        (event.target as HTMLInputElement).selectionStart === 0
      )
    ) {
      event.preventDefault();
    }
  }

  formatCurrency(value: string): string {
    if (typeof value !== 'string') {
      value = String(value);
    }

    value = value.replace(/[^\d\-,.]/g, '');

    const isNegative = value.startsWith('-');
    const numericValue = Number(value.replace(/[,$-]/g, ''));

    const formatted = numericValue.toLocaleString('es-MX', {
      maximumFractionDigits: 2,
    });

    return isNegative ? `-${formatted}` : formatted;
  }
}
