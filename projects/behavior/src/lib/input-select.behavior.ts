import { Directive, signal } from '@angular/core';
import { FormControlBase } from '@ng-modular-forms/core';

export interface SelectOption {
  key: string | number;
  label: string | number;
  disabled?: boolean;
}

@Directive()
export class InputSelectBehavior {
  private _initialValue = signal<string | number | null>(null);

  initialValue = this._initialValue.asReadonly();

  setInitialValue(value: string | number | null) {
    this._initialValue.set(value);
  }

  onSelectionClosed(ctx: FormControlBase<string | number | null>): void {
    const control = ctx.ngControl?.control;
    if (!control) return;

    if (control.value === '') {
      control?.markAsDirty();
    }
  }

  onSelectionChange(
    ctx: FormControlBase<string | number | null>,
    event: { value: string | number | null },
  ): void {
    let value = event.value;
    if (value === 'NONE') {
      value = typeof this._initialValue() === 'number' ? -1 : '';
    } else {
      value = event.value;
    }

    if (value != null) {
      ctx.value = value;
      ctx.onChange(value);
    }
  }
}
