import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  TouchedChangeEvent,
  Validators,
} from '@angular/forms';
import {
  booleanAttribute,
  ChangeDetectorRef,
  computed,
  DestroyRef,
  Directive,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith, Subscription } from 'rxjs';

@Directive()
export abstract class FormControlBase<T> implements ControlValueAccessor {
  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly destroyRef = inject(DestroyRef);

  static nextId = 0;

  readonly id = input<string | null>(
    `nmf-form-control-${FormControlBase.nextId++}`,
  );

  readonly _id = input<string | null>(null, { alias: 'id' });
  readonly label = input<string>('');
  readonly classList = input<string[]>([]);
  readonly loading = input<boolean>(false);

  readonly name = input<string>('');
  readonly placeholder = input<string>('');
  readonly _disabledByInput = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });
  readonly _disabledByCva = signal(false);

  readonly ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });

  protected readonly control = new FormControl<T | null>(null);

  protected readonly disabled = computed(
    () => this._disabledByInput() || this._disabledByCva(),
  );

  protected readonly isRequired = signal(
    this.ngControl?.control?.hasValidator(Validators.required) ?? false,
  );

  protected readonly hasErrors = signal(false);

  private changeSub = new Subscription();

  protected onChange: (value: T | null) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      const inputDisabled = this._disabledByInput();
      const cvaDisabled = this._disabledByCva();

      if (inputDisabled || cvaDisabled) {
        this.control.disable({ emitEvent: false });
      } else {
        this.control.enable({ emitEvent: true });
      }
    });
  }

  ngOnInit() {
    const parent = this.ngControl?.control;
    if (!parent) return;

    parent.statusChanges
      .pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.control.setValidators(parent.validator ?? null);
        this.control.setAsyncValidators(parent.asyncValidator ?? null);
        this.control.updateValueAndValidity({ emitEvent: false });

        this.hasErrors.set(parent.invalid && parent.touched);
        this.isRequired.set(parent.hasValidator(Validators.required) ?? false);

        this.cdr.markForCheck();
      });

    parent.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof TouchedChangeEvent) {
          if (parent.touched) {
            this.control.markAsTouched();
          } else {
            this.control.markAsUntouched();
          }
          this.hasErrors.set(parent.invalid && parent.touched);
          this.cdr.markForCheck();
        }
      });

    parent.valueChanges
      .pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());
  }

  writeValue(value: T): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;

    this.changeSub.unsubscribe();
    this.changeSub = this.control.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((v) => {
        fn(v);
      });
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
