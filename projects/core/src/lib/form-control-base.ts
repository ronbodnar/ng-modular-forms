import { NgControl, Validators } from '@angular/forms';
import {
  booleanAttribute,
  ChangeDetectorRef,
  computed,
  DestroyRef,
  Directive,
  DoCheck,
  HostBinding,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Directive()
export abstract class FormControlBase<T> implements OnInit, DoCheck {
  static nextId = 0;

  @HostBinding()
  id = `nmf-form-control-${FormControlBase.nextId++}`;

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly destroyRef = inject(DestroyRef);

  readonly ngControl = inject(NgControl, {
    optional: true,
    self: true,
  });

  readonly label = input<string>('');
  readonly classList = input<string[]>([]);
  readonly loading = input<boolean>(false);

  readonly _name = input<string>('', { alias: 'name' });
  readonly _placeholder = input<string>('', { alias: 'placeholder' });
  readonly _required = input<boolean, unknown>(false, {
    alias: 'required',
    transform: booleanAttribute,
  });
  readonly _disabledByInput = input<boolean, unknown>(false, {
    alias: 'disabled',
    transform: booleanAttribute,
  });
  readonly _readonly = input<boolean>(false, { alias: 'readonly' });

  protected readonly _disabledByCva = signal(false);
  readonly _disabled = computed(
    () => this._disabledByInput() || this._disabledByCva() || this.loading(),
  );

  focused = false;

  private lastErrorState = false;

  private _value: T | null = null;

  get value(): T | null {
    return this._value;
  }

  set value(value: T | null) {
    this._value = value;
    this.cdr.markForCheck();
  }

  get name(): string {
    return this._name();
  }

  get placeholder(): string {
    return this._placeholder();
  }

  get required(): boolean {
    const formControl = this.ngControl?.control;
    const required =
      !!formControl && formControl.hasValidator(Validators.required);
    return this._required() || required;
  }

  get disabled(): boolean {
    return this._disabled();
  }

  get readonly(): boolean {
    return this._readonly();
  }

  get errorState(): boolean {
    const control = this.ngControl?.control;
    return !!control && control.invalid && control.touched;
  }

  get empty(): boolean {
    return (
      this._value === null || this._value === '' || this._value === undefined
    );
  }

  ngOnInit() {
    const control = this.ngControl?.control;
    if (!control) {
      throw new Error(`FormControl ${this.id} not found`);
    }

    control.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => this.cdr.markForCheck());
  }

  ngDoCheck() {
    const newState = this.errorState;

    if (newState !== this.lastErrorState) {
      this.lastErrorState = newState;
      this.cdr.markForCheck();
    }
  }

  protected getErrorMessage(): string | null {
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
}
