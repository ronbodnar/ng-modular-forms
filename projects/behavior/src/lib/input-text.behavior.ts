import { signal } from '@angular/core';
import { FormControlBase } from '@ng-modular-forms/core';

export class InputTextBehavior {
  private _hidePassword = signal<boolean>(true);

  hidePassword = this._hidePassword.asReadonly();

  setHidePassword(value: boolean) {
    this._hidePassword.set(value);
  }

  onInput(ctx: FormControlBase<string | number | null>, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    ctx.value = value;
    ctx.onChange(value);
  }

  toggleShowPassword(event: MouseEvent) {
    event.stopPropagation();
    this._hidePassword.set(!this.hidePassword());
  }
}
