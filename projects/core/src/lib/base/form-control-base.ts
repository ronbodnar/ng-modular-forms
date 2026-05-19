import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  TouchedChangeEvent,
  Validators,
} from '@angular/forms';
import {
  booleanAttribute,
  computed,
  DestroyRef,
  Directive,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, startWith } from 'rxjs';

@Directive()
export abstract class FormControlBase<T> implements ControlValueAccessor {
  protected readonly destroyRef = inject(DestroyRef);

  static nextId = 0;
  readonly id = input<string | null>(
    `nmf-form-control-${FormControlBase.nextId++}`,
    { alias: 'id' },
  );

  readonly label = input<string>('');
  readonly classList = input<string[]>([]);
  readonly loading = input<boolean>(false);
  readonly name = input<string>('');
  readonly placeholder = input<string>('');

  readonly _disabledByInput = input<boolean, unknown>(false, {
    transform: booleanAttribute,
    alias: 'disabledOverride',
  });
  readonly _disabledByCva = signal(false);

  readonly ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });

  protected readonly standaloneControl = new FormControl<T | null>(null);

  get formControl(): FormControl<T | null> {
    return (
      (this.ngControl?.control as FormControl<T | null> | null) ??
      this.standaloneControl
    );
  }

  protected readonly disabled = computed(
    () => this._disabledByInput() || this._disabledByCva(),
  );

  protected readonly isRequired = signal(
    this.ngControl?.control?.hasValidator(Validators.required) ?? false,
  );

  protected readonly hasErrors = signal(false);

  protected onChange: (value: T | null) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    const control = this.ngControl?.control;
    if (!control) return;

    merge(control.statusChanges, control.valueChanges)
      .pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.hasErrors.set(control.invalid && control.touched);
        this.isRequired.set(control.hasValidator(Validators.required) ?? false);
      });

    control.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof TouchedChangeEvent) {
          this.hasErrors.set(control.invalid && control.touched);
        }
      });
  }

  writeValue(value: T | null): void {
    const control = this.ngControl?.control;
    if (!control) return;

    if (control.value !== value) {
      control.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabledByCva.set(isDisabled);
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
}
