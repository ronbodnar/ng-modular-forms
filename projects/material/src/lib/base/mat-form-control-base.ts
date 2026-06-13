import { Directive, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormControlBase } from '@ng-modular-forms/core';

@Directive()
export abstract class MatFormControlBase<
  TValue,
  TDisplayValue = string,
> extends FormControlBase<TValue> {
  detachLabel = input<boolean>(false);

  appearance = input<'outline' | 'fill'>('outline');
  shouldLabelFloat = input<'always' | 'auto'>('auto');

  hint = input<string>();
  hintClassList = input<string>('');

  // Purely a state carrier for mat-form-field, never drives value or internal state
  readonly displayControl = new FormControl<TDisplayValue | null>({
    value: null,
    disabled: false,
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
