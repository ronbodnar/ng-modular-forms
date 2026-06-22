import { computed, Directive, inject, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlBase } from '@ng-modular-forms/core';
import { NMF_MATERIAL_CONFIG } from '../providers/mat-config.provider';
import {
  FloatLabelType,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldAppearance,
} from '@angular/material/form-field';
import { toSignal } from '@angular/core/rxjs-interop';

@Directive({})
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

  protected readonly displayValue = toSignal(this.displayControl.valueChanges, {
    initialValue: this.displayControl.value,
  });

  override writeValue(value: TValue | null): void {
    super.writeValue(value);

    this.displayControl.setValue(value as unknown as TDisplayValue | null, {
      emitEvent: false,
    });
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
    }
    if (control.dirty) {
      this.displayControl.markAsDirty();
    }

    this.displayControl.setErrors(control.errors);
  }
}
