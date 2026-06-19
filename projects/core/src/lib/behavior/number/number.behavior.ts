export class NumberBehavior {
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
      const isAtStart = input.selectionStart === 0;

      if (hasMinus || !isAtStart) {
        event.preventDefault();
      }
      return;
    }

    event.preventDefault();
  }
}
