import { signal } from '@angular/core';

export class InputTextBehavior {
  private _showPassword = signal<boolean>(false);

  showPassword = this._showPassword.asReadonly();

  toggleShowPassword() {
    this._showPassword.set(!this.showPassword());
  }
}
