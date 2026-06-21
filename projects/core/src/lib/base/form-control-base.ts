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
import { NMF_CONFIG } from '../providers/config.provider';

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
  readonly hint = input<string>();
  readonly hintClassList = input<string>('');

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
  private readonly config = inject(NMF_CONFIG);

  private _focused = signal(false);

  private _value: TValue | null = null;

  protected readonly disabled = computed(
    () => this._disabledByInput() || this._disabledByCva(),
  );

  protected readonly isRequired = signal(
    this.ngControl?.control?.hasValidator(Validators.required) ?? false,
  );

  protected readonly hasErrors = signal(false);

  translatedLabel = computed(() => this.translate(this.label()));
  translatedHint = computed(() => this.translate(this.hint()));
  translatedPlaceholder = computed(() => this.translate(this.placeholder()));

  protected onChange: (value: TValue | null) => void = () => {};
  protected onTouched: () => void = () => {};

  get value(): TValue | null {
    return this._value;
  }

  get control(): FormControl<ControlValue<TValue>> {
    return this.ngControl?.control as FormControl<ControlValue<TValue>>;
  }

  protected focused = this._focused.asReadonly();

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
    this._focused.set(true);
  }

  blur(): void {
    const target = this.focusableElement();
    if (!target) return;

    if (target instanceof ElementRef) {
      target.nativeElement.blur();
    } else if ('blur' in target && typeof target.blur === 'function') {
      target.blur();
    }
    this._focused.set(false);
    this.onTouched();
  }

  onFocusIn(): void {
    if (this.focused()) {
      return;
    }
    this._focused.set(true);
  }

  onFocusOut(): void {
    //this.control?.markAsTouched();
    this._focused.set(false);
    this.onTouched();
  }

  protected translatedErrorMessage(): string | null {
    const control = this.control;
    if (control == null || !control.errors || !control.touched) return null;

    const firstKey = Object.keys(control.errors)[0];
    const error = control.errors[firstKey];

    switch (firstKey) {
      case 'required':
        return this.translate(
          this.config.validationMessages?.required ?? 'This field is required',
        );

      case 'minlength':
        return this.translate(
          this.config.validationMessages?.minlength ??
            'Minimum length is {requiredLength}',
          { requiredLength: error.requiredLength },
        );

      case 'maxlength':
        return this.translate(
          this.config.validationMessages?.maxlength ??
            'Maximum length is {requiredLength}',
          { requiredLength: error.requiredLength },
        );

      case 'min':
        return this.translate(
          this.config.validationMessages?.min ?? 'Minimum value is {min}',
          { min: error.min },
        );

      case 'max':
        return this.translate(
          this.config.validationMessages?.max ?? 'Maximum value is {max}',
          { max: error.max },
        );

      case 'email':
        return this.translate(
          this.config.validationMessages?.email ?? 'Invalid email address',
        );

      case 'pattern':
        return this.translate(
          this.config.validationMessages?.pattern ?? 'Invalid format',
        );

      case 'custom':
        if (typeof error === 'string') {
          return this.translate(error);
        }
        return this.translate(
          this.config.validationMessages?.fallback ?? 'Invalid value',
        );

      default:
        return this.translate(
          this.config.validationMessages?.fallback ?? 'Invalid value',
        );
    }
  }

  protected translate(
    value: string | null | undefined,
    params?: Record<string, unknown>,
  ): string {
    if (!value) {
      return '';
    }

    return this.config.translate?.(value, params) ?? value;
  }
}
