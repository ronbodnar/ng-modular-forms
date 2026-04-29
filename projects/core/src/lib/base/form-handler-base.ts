import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { getControl } from '../form-util';

export abstract class FormHandlerBase<ControlNames extends string = string> {
  abstract getReactiveLogic(form: FormGroup): Subscription;

  private registeredControls: Record<string, FormControl> = {};

  /**
   * Registers form controls for later reactive access.
   */
  registerControls(form: FormGroup, controlNames: ControlNames[]): void {
    controlNames.forEach((cn) => {
      const control = getControl(cn.replace(/_/g, '.'), form);

      if (!control) {
        throw new Error(
          `Failed to register control with name: "${cn}" in form group: "${form}"`,
        );
      }

      const key = cn as ControlNames;
      this.registeredControls[key] = control;
    });
  }

  valueChangesOf<T>(key: ControlNames): Observable<T> {
    if (!this.registeredControls[key]) {
      throw new Error(
        `Control with name: "${key}" not found. Ensure it is registered in registerControls(...)`,
      );
    }

    return this.registeredControls[key].valueChanges as Observable<T>;
  }
}
