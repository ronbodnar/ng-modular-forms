import {
  AfterViewInit,
  Directive,
  effect,
  input,
  ViewChild,
} from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { FormControlBase } from '@ng-modular-forms/core';

/**
 * This class serves as a base for form field+control wrappers that use Angular Material components.
 *
 * It does not implement MatFormFieldControl as it is intended to wrap the full MatFormField, not be a control within it.
 */
@Directive()
export abstract class MatFormControlBase<T>
  extends FormControlBase<T>
  implements AfterViewInit
{
  detachLabel = input<boolean>(false);

  appearance = input<'outline' | 'fill'>('outline');
  shouldLabelFloat = input<'always' | 'auto'>('auto');

  hint = input<string>();
  hintClassList = input<string>('');

  @ViewChild(MatInput) protected matInput?: MatInput;
  @ViewChild(MatSelect) protected matSelect?: MatSelect;

  constructor() {
    super();

    /*
     * Synchronizes the loading state with the MatFormControlBase's disabled state.
     */
    effect(() => {
      const control = this.ngControl?.control;
      if (!control) return;

      const shouldDisable = this.loading() || this._disabledByInput();
      const isCurrentlyDisabled = control.disabled;

      if (shouldDisable && !isCurrentlyDisabled) {
        control.disable({ emitEvent: false });
      }
      if (!shouldDisable && isCurrentlyDisabled) {
        control.enable({ emitEvent: false });
      }
    });
  }

  ngAfterViewInit(): void {
    const matControl = this.matInput ?? this.matSelect;
    if (matControl && this.ngControl) {
      matControl.ngControl = this.ngControl;

      Object.defineProperty(matControl, 'errorState', {
        get: () => this.errorState,
      });
    }
  }
}
