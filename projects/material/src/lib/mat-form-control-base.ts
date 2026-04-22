import {
  Directive,
  effect,
  input,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FormControlBase } from '@ng-modular-forms/core';

@Directive()
export abstract class MatFormControlBase<T>
  extends FormControlBase<T>
  implements ControlValueAccessor
{
  detachLabel = input<boolean>(false);
  hint = input<string>();
  hintClassList = input<string>('');
  appearance = input<'outline' | 'fill'>('outline');
  shouldLabelFloat = input<'always' | 'auto'>('auto');

  constructor(@Optional() @Self() public override ngControl: NgControl) {
    super();

    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      const control = this.ngControl?.control;
      if (!control) return;

      const shouldDisable = this.loading() || this._disabledByInput();

      const isCurrentlyDisabled = control.disabled;

      if (shouldDisable && !isCurrentlyDisabled) {
        control.disable({ emitEvent: false });
      }

      if (!shouldDisable && isCurrentlyDisabled) {
        control.enable({ emitEvent: false });
      }
    });
  }

  onChange = (_value: T) => {};
  onTouched = () => {};

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

  @ViewChild(MatInput) protected matInput?: MatInput;
  @ViewChild(MatSelect) protected matSelect?: MatSelect;

  ngAfterViewInit() {
    const matControl = this.matInput ?? this.matSelect;
    if (matControl && this.ngControl) {
      matControl.ngControl = this.ngControl;
      Object.defineProperty(matControl, 'errorState', {
        get: () => this.errorState,
      });
    }
    this.cdr.markForCheck();
  }
}
