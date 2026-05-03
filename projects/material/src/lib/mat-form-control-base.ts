import { Directive, input } from '@angular/core';
import { FormControlBase } from '@ng-modular-forms/core';

@Directive()
export abstract class MatFormControlBase<T> extends FormControlBase<T> {
  detachLabel = input<boolean>(false);

  appearance = input<'outline' | 'fill'>('outline');
  shouldLabelFloat = input<'always' | 'auto'>('auto');

  hint = input<string>();
  hintClassList = input<string>('');
}
