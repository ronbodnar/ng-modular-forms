import {
  Directive,
  ElementRef,
  HostBinding,
  Optional,
  Self,
  inject,
  ChangeDetectorRef,
  input,
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

  protected readonly _name = input<string>('', { alias: 'name' });
  protected readonly _placeholder = input<string>('', { alias: 'placeholder' });
  protected readonly _required = input<boolean>(false, { alias: 'required' });
  protected readonly _disabled = input<boolean>(false, { alias: 'disabled' });
  protected readonly _readonly = input<boolean>(false, { alias: 'readonly' });

  protected readonly formControlName = input<string>('');

  get name(): string {
    return this._name();
  }

  get placeholder(): string {
    return this._placeholder();
  }

  get required(): boolean {
    return this._required();
  }

  get disabled(): boolean {
    return this._disabled();
  }

  get readonly(): boolean {
    return this._readonly();
  }

  static nextId = 0;

  @HostBinding()
  id = `nmf-form-control-${FormControlValueAccessor.nextId++}`;

  _value: T | null = null;

  get value(): T | null {
    return this._value;
  }

  set value(val: T | null) {
    this._value = val;
  }

  onChange = (_value: T) => {};
  onTouched = () => {};

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    protected elementRef: ElementRef<HTMLElement>,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: T): void {
    this._value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
