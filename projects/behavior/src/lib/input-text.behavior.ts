import { signal } from '@angular/core';

export class InputTextBehavior {
  private _showPassword = signal<boolean>(false);

  showPassword = this._showPassword.asReadonly();

  toggleShowPassword(event: MouseEvent): void {
    event.stopPropagation();
    this._showPassword.set(!this.showPassword());
  }
}
