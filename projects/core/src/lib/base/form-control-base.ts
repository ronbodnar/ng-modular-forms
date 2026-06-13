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
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { merge, startWith } from 'rxjs';

type ControlValue<T> = T | null;

@Directive()
export abstract class FormControlBase<TValue> implements ControlValueAccessor {
  static nextId = 0;

  readonly focusableElement = viewChild<
    ElementRef<HTMLElement> | { focus: () => void; blur: () => void }
  >('focusable');

  readonly id = input<string>(`nmf-form-control-${FormControlBase.nextId++}`);
  readonly label = input<string>('');
  readonly loading = input<boolean>(false);
  readonly name = input<string>('');
  readonly placeholder = input<string>('');
  readonly autocompleteAttr = input<string | null>(null);
  readonly _classList = input<string | string[]>('', { alias: 'classList' });

  readonly classList = computed(() => {
    const classList = this._classList();

    if (Array.isArray(classList)) {
      return classList.filter((className) => !!className.trim());
    }

    return classList.split(/\s+/).filter((className) => className.length > 0);
  });

  readonly _disabledByInput = input<boolean, unknown>(false, {
    transform: booleanAttribute,
    alias: 'disabledOverride',
  });
  readonly _disabledByCva = signal(false);

  readonly cdr = inject(ChangeDetectorRef);
  readonly destroyRef = inject(DestroyRef);
  readonly ngControl = inject(NgControl, {
    optional: true,
  });

  private _focused = signal(false);

  private _value: TValue | null = null;

  protected readonly disabled = computed(
    () => this._disabledByInput() || this._disabledByCva(),
  );

  protected readonly isRequired = signal(
    this.ngControl?.control?.hasValidator(Validators.required) ?? false,
  );

  protected readonly hasErrors = signal(false);

  protected onChange: (value: TValue | null) => void = () => {};
  protected onTouched: () => void = () => {};

  get value(): TValue | null {
    return this._value;
  }

  get control(): FormControl<ControlValue<TValue>> {
    return this.ngControl?.control as FormControl<ControlValue<TValue>>;
  }

  get focused(): boolean {
    return this._focused();
  }

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    const control = this.control;
    if (!control) return;

    merge(control.statusChanges, control.valueChanges)
      .pipe(startWith(null), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.onControlStateChange();
      });

    control.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (event instanceof TouchedChangeEvent) {
          this.onControlStateChange();
        }
      });
  }

  protected onControlStateChange(): void {
    const control = this.control;
    if (!control) {
      return;
    }

    this.hasErrors.set(control.invalid && control.touched);
    this.isRequired.set(control.hasValidator(Validators.required) ?? false);

    this.cdr.markForCheck();
  }

  writeValue(value: TValue | null): void {
    this._value = value;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: TValue | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabledByCva.set(isDisabled);
  }

  focus(): void {
    const target = this.focusableElement();
    if (!target) return;

    // Type guard check for native ElementRef wrapper
    if (target instanceof ElementRef) {
      target.nativeElement.focus();
    }
    // Type guard check for a custom component instance with executable methods
    else if ('focus' in target && typeof target.focus === 'function') {
      target.focus();
    }
  }

  blur(): void {
    const target = this.focusableElement();
    if (!target) return;

    if (target instanceof ElementRef) {
      target.nativeElement.blur();
    } else if ('blur' in target && typeof target.blur === 'function') {
      target.blur();
    }
  }

  onFocusIn(): void {
    if (this.focused) {
      return;
    }
    this._focused.set(true);
  }

  onFocusOut(): void {
    //this.control?.markAsTouched();
    this._focused.set(false);
    this.onTouched();
  }

  protected errorMessage(): string | null {
    const control = this.control;
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
