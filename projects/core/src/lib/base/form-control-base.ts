import {
  ControlValueAccessor,
  FormControl,
  NgControl,
  TouchedChangeEvent,
  Validators,
} from '@angular/forms';
import {
  afterNextRender,
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

  readonly id = input<string>(`nmf-form-control-${FormControlBase.nextId++}`);
  readonly label = input<string>('');
  readonly loading = input<boolean>(false);
  readonly name = input<string>('');
  readonly placeholder = input<string>('');
  readonly autocomplete = input<string | null>(null);
  readonly autofocus = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly _classList = input<string | string[]>('', { alias: 'classList' });
  readonly hintLabel = input<string>();
  readonly hintClassList = input<string>('');
  readonly ariaLabel = input<string | null>(null);
  readonly ariaDescribedBy = input<string | null>(null);
  readonly ariaLabelledBy = input<string | null>(null);
  readonly _disabledByInput = input<boolean, unknown>(false, {
    transform: booleanAttribute,
    alias: 'disabledOverride',
  });

  protected readonly cdr = inject(ChangeDetectorRef);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly ngControl = inject(NgControl, {
    optional: true,
  });
  private readonly config = inject(NMF_CONFIG);

  private readonly focusableElement = viewChild<
    ElementRef<HTMLElement> | { focus: () => void; blur: () => void }
  >('focusable');

  private _disabledByCva = signal(false);
  private _focused = signal(false);
  private _value = signal<TValue | null>(null);

  protected readonly disabled = computed(
    () => this._disabledByInput() || this._disabledByCva(),
  );

  readonly classList = computed(() => {
    const classList = this._classList();

    if (Array.isArray(classList)) {
      return classList.filter((className) => !!className.trim());
    }

    return classList.split(/\s+/).filter((className) => className.length > 0);
  });

  protected isRequired(): boolean {
    return this.control?.hasValidator(Validators.required) ?? false;
  }

  protected hasErrors(): boolean {
    const control = this.control;
    return !!control && control.invalid && control.touched;
  }

  translatedLabel = computed(() => this.translate(this.label()));
  translatedHintLabel = computed(() => this.translate(this.hintLabel()));
  translatedPlaceholder = computed(() => this.translate(this.placeholder()));

  protected onChange: (value: TValue | null) => void = () => {};
  protected onTouched: () => void = () => {};

  readonly value = this._value.asReadonly();

  get control(): FormControl<ControlValue<TValue>> {
    return this.ngControl?.control as FormControl<ControlValue<TValue>>;
  }

  protected focused = this._focused.asReadonly();

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    afterNextRender(() => {
      if (this.autofocus()) {
        this.focus();
      }
    });
  }

  ngOnInit(): void {
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

  ngDoCheck(): void {
    this.onControlStateChange();
  }

  protected onControlStateChange(): void {
    this.cdr.markForCheck();
  }

  writeValue(value: TValue | null): void {
    this._value.set(value);
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: TValue | null) => void): void {
    this.onChange = (value: TValue | null) => {
      this._value.set(value);
      fn(value);
      this.cdr.markForCheck();
    };
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

    if (target instanceof ElementRef) {
      target.nativeElement.focus();
    } else if ('focus' in target && typeof target.focus === 'function') {
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
    this.cdr.markForCheck();
  }

  onFocusIn(): void {
    if (this.focused()) {
      return;
    }
    this._focused.set(true);
  }

  onFocusOut(): void {
    this._focused.set(false);
    this.onTouched();
    this.cdr.markForCheck();
  }

  protected translatedErrorMessage(): string | null {
    const control = this.control;
    if (control == null || !control.errors || !control.touched) return null;

    const firstKey = Object.keys(control.errors)[0];
    const error = control.errors[firstKey];

    switch (firstKey) {
      case 'required':
        return this.translate(
          this.config.translations?.validationMessages?.required ??
            'This field is required',
        );

      case 'minlength':
        return this.translate(
          this.config.translations?.validationMessages?.minLength ??
            'Minimum length is {{requiredLength}}',
          { requiredLength: error.requiredLength },
        );

      case 'maxlength':
        return this.translate(
          this.config.translations?.validationMessages?.maxLength ??
            'Maximum length is {{requiredLength}}',
          { requiredLength: error.requiredLength },
        );

      case 'min':
        return this.translate(
          this.config.translations?.validationMessages?.min ??
            'Minimum value is {{min}}',
          { min: error.min },
        );

      case 'max':
        return this.translate(
          this.config.translations?.validationMessages?.max ??
            'Maximum value is {{max}}',
          { max: error.max },
        );

      case 'email':
        return this.translate(
          this.config.translations?.validationMessages?.email ??
            'Invalid email address',
        );

      case 'pattern':
        return this.translate(
          this.config.translations?.validationMessages?.pattern ??
            'Invalid format',
        );

      case 'custom':
        if (typeof error === 'string') {
          return this.translate(error);
        }
        return this.translate(
          this.config.translations?.validationMessages?.fallback ??
            'Invalid value',
        );

      default:
        return this.translate(
          this.config.translations?.validationMessages?.fallback ??
            'Invalid value',
        );
    }
  }

  protected translate(
    key: string | null | undefined,
    params?: Record<string, unknown>,
  ): string {
    if (!key) {
      return '';
    }

    const translation = key.split('.').reduce<unknown>((obj, part) => {
      if (obj && typeof obj === 'object') {
        return (obj as Record<string, unknown>)[part];
      }

      return undefined;
    }, this.config.translations);

    const value = typeof translation === 'string' ? translation : key;

    return this.config.translate?.(value, params) ?? value;
  }
}
