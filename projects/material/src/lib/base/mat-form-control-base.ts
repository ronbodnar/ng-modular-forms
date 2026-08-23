import { computed, Directive, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { FormControlBase } from '@ng-modular-forms/core';
import { NMF_MATERIAL_CONFIG } from '../providers/mat-config.provider';
import {
  FloatLabelType,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldAppearance,
} from '@angular/material/form-field';

@Directive({
  host: {
    class: 'nmf-material',
  },
})
export abstract class MatFormControlBase<
  TValue,
  TDisplayValue = string,
> extends FormControlBase<TValue> {
  private readonly materialConfig = inject(NMF_MATERIAL_CONFIG);
  private readonly materialDefaults = inject(MAT_FORM_FIELD_DEFAULT_OPTIONS, {
    optional: true,
  });

  readonly _detachLabel = input<boolean>(
    this.materialConfig.detachLabels ?? false,
    {
      alias: 'detachLabel',
    },
  );

  readonly _appearance = input<MatFormFieldAppearance>(
    this.materialConfig.appearance ??
      this.materialDefaults?.appearance ??
      'outline',
    {
      alias: 'appearance',
    },
  );

  readonly _shouldLabelFloat = input<FloatLabelType>(
    this.materialConfig.floatLabel ??
      this.materialDefaults?.floatLabel ??
      'auto',
    {
      alias: 'shouldLabelFloat',
    },
  );

  readonly _hideRequiredMarker = input<boolean>(
    this.materialConfig.hideRequiredMarker ??
      this.materialDefaults?.hideRequiredMarker ??
      false,
    {
      alias: 'hideRequiredMarker',
    },
  );

  readonly detachLabel = computed(
    () => this._detachLabel() ?? this.materialConfig.detachLabels,
  );

  readonly appearance = computed(
    () => this._appearance() ?? this.materialConfig.appearance,
  );

  readonly shouldLabelFloat = computed(
    () => this._shouldLabelFloat() ?? this.materialConfig.floatLabel,
  );

  readonly hideRequiredMarker = computed(
    () =>
      this._hideRequiredMarker() ??
      this.materialConfig.hideRequiredMarker ??
      false,
  );

  /*
   * Slots are prefix and suffix elements. They should only be shown under these conditions.
   */
  readonly showSlots = computed(() => this.focused() || this.value() != null);

  // Purely a state carrier for mat-form-field, never drives value or internal state
  protected readonly displayControl = new FormControl<TDisplayValue | null>({
    value: null,
    disabled: false,
  });

  private readonly _displayValue = signal<TDisplayValue | null>(
    this.displayControl.value,
  );
  protected readonly displayValue = this._displayValue.asReadonly();

  constructor() {
    super();

    this.displayControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this._displayValue.set(value));
  }

  override writeValue(value: TValue | null): void {
    super.writeValue(value);

    const displayValue = value as unknown as TDisplayValue | null;
    this.displayControl.setValue(displayValue, { emitEvent: false });
    this._displayValue.set(displayValue);
  }

  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);

    if (isDisabled) {
      this.displayControl.disable({ emitEvent: false });
    } else {
      this.displayControl.enable({ emitEvent: false });
    }
  }

  override onControlStateChange(): void {
    super.onControlStateChange();

    const control = this.control;
    if (!control) {
      return;
    }

    if (control.touched) {
      this.displayControl.markAsTouched();
    } else {
      this.displayControl.markAsUntouched();
    }

    if (control.dirty) {
      this.displayControl.markAsDirty();
    } else {
      this.displayControl.markAsPristine();
    }

    this.displayControl.setErrors(control.errors);
  }
}
