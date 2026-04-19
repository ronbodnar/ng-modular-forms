import {
  Directive,
  ElementRef,
  HostBinding,
  Optional,
  Self,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

/**
 * Base implementation for custom form controls that integrate with Angular Reactive Forms (ControlValueAccessor)
 *
 * NOTE: This class is UI-layer only and should not be used in form orchestration logic.
 */

@Directive()
export abstract class FormControlValueAccessor<
  T,
> implements ControlValueAccessor {
  protected readonly cdr = inject(ChangeDetectorRef);

  static nextId = 0;

  @HostBinding()
  id = `nmf-form-control-${FormControlValueAccessor.nextId++}`;

  _value: T | null = null;

  get value(): T | null {
    return this._value;
  }

  constructor(@Optional() @Self() public ngControl: NgControl) {}

  onChange = (_value: T) => {};
  onTouched = () => {};

  writeValue(value: T): void {
    this._value = value;
    console.log('writing FCVA value:', value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
