import { Directive, input } from '@angular/core';
import { FormControlBase } from '@ng-modular-forms/core';

@Directive()
export abstract class InputFormControlBase<T> extends FormControlBase<T> {
  detachLabel = input<boolean>(false);
  shouldLabelFloat = input<'always' | 'auto'>('auto');
}
