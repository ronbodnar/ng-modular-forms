import { Directive, input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { FormControlBase } from '@ng-modular-forms/core';

@Directive()
export abstract class InputFormControlBase<T>
  extends FormControlBase<T>
  implements ControlValueAccessor
{
  detachLabel = input<boolean>(false);
  shouldLabelFloat = input<'always' | 'auto'>('auto');

  /** Implemented as part of ControlValueAccessor */
  protected onChange: (value: T) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: T): void {
    this.value = value;
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabledByCva.set(isDisabled);
    this.cdr.markForCheck();
  }
}
