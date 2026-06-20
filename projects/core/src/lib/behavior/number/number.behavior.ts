export class NumberBehavior {
  sanitize(value: string, allowNegative: boolean): string {
    if (!value) return '';

    let cleaned = value.replace(/[^0-9.-]/g, '');

    const isJustMinus = cleaned === '-';
    if (isJustMinus && allowNegative) return '-';

    const parts = cleaned.split('.');
    if (parts.length > 2) {
      cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    const hasMinus = cleaned.includes('-');
    if (hasMinus) {
      cleaned = cleaned.replace(/-/g, '');
      if (allowNegative) {
        cleaned = '-' + cleaned;
      }
    }

    return cleaned;
  }

  blockNonDigitKey(event: KeyboardEvent, allowNegative = true): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (event.ctrlKey || event.metaKey) {
      return;
    }

    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Enter',
      'Escape',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    const isDigit = /^[0-9]$/.test(event.key);
    if (isDigit) {
      return;
    }

    if (event.key === '.') {
      if (value.includes('.')) {
        event.preventDefault();
      }
      return;
    }

    if (event.key === ',') {
      event.preventDefault();
      return;
    }

    if (event.key === '-') {
      if (!allowNegative) {
        event.preventDefault();
        return;
      }

      const hasMinus = value.includes('-');
      const el =
        (event.target as HTMLInputElement | null) ??
        (event.currentTarget as HTMLInputElement | null);

      const pos = el?.selectionStart != null ? el.selectionStart : value.length;

      const isAtStart = pos === 0;

      if (hasMinus || !isAtStart) {
        event.preventDefault();
      }
      return;
    }

    event.preventDefault();
  }
}
