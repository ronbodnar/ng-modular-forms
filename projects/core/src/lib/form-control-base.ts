import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import {
  booleanAttribute,
  ChangeDetectorRef,
  computed,
  DestroyRef,
  Directive,
  HostBinding,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge } from 'rxjs';

@Directive()
export abstract class FormControlBase<T> implements ControlValueAccessor {
  static nextId = 0;

  @HostBinding()
  id = `nmf-form-control-${FormControlBase.nextId++}`;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly destroyRef = inject(DestroyRef);

  readonly ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });

  readonly label = input<string>('');
  readonly classList = input<string[]>([]);
  readonly loading = input<boolean>(false);

  readonly _name = input<string>('', { alias: 'name' });
  readonly _placeholder = input<string>('', { alias: 'placeholder' });
  readonly _readonly = input<boolean>(false, { alias: 'readonly' });
  readonly _required = input<boolean, unknown>(false, {
    alias: 'required',
    transform: booleanAttribute,
  });
  readonly _disabledByInput = input<boolean, unknown>(false, {
    alias: 'disabled',
    transform: booleanAttribute,
  });

  private readonly _focused = signal(false);
  protected readonly _disabledByCva = signal(false);
  protected readonly _disabled = computed(
    () => this._disabledByInput() || this._disabledByCva(),
  );

  private lastErrorState = false;
  private _value: T | null = null;

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get value(): T | null {
    return this._value;
  }

  set value(value: T | null) {
    this._value = value;
  }

  get name(): string {
    return this._name();
  }

  get placeholder(): string {
    return this._placeholder();
  }

  get disabled(): boolean {
    return this._disabled();
  }

  get readonly(): boolean {
    return this._readonly();
  }

  get focused(): boolean {
    return this._focused();
  }

  get empty(): boolean {
    return (
      this._value === null || this._value === '' || this._value === undefined
    );
  }

  get required(): boolean {
    const formControl = this.ngControl?.control;
    const required =
      !!formControl && formControl.hasValidator(Validators.required);
    return this._required() || required;
  }

  get errorState(): boolean {
    const control = this.ngControl?.control;
    return !!control && control.invalid && control.touched;
  }

  /** Implemented as part of ControlValueAccessor */
  protected onChange: (value: T) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: T): void {
    this.value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    console.log('setDisabledState', isDisabled);
    this._disabledByCva.set(isDisabled);
    this.cdr.markForCheck();
  }

  protected errorMessage(): string | null {
    const control = this.ngControl?.control;
    if (control == null || !control.errors || !control.touched) return null;

    const firstKey = Object.keys(control.errors)[0];
    const error = control.errors[firstKey];

    switch (firstKey) {
      case 'required':
        return 'This field is required';
      case 'minlength':
        return `Minimum length is ${error.requiredLength}`;
      case 'maxlength':
        return `Maximum length is ${error.requiredLength}`;
      case 'min':
        return `Minimum value is ${error.min}`;
      case 'max':
        return `Maximum value is ${error.max}`;
      case 'email':
        return 'Invalid email address';
      case 'pattern':
        return 'Invalid format';
      case 'custom':
        if (typeof error === 'string') {
          return error;
        }
        return 'Invalid value';
      default:
        return 'Invalid value';
    }
  }

  ngOnInit() {
    const control = this.ngControl?.control;
    if (!control) {
      throw new Error(`FormControl ${this.id} not found`);
    }

    merge(control.statusChanges, control.valueChanges, control.events)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());

    this.cdr.markForCheck();
  }
}
