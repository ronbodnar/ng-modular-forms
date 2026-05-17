import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { getControl } from '../form-util';

export abstract class FormHandlerBase<ControlNames extends string = string> {
  abstract getReactiveLogic(form: FormGroup): Subscription;

  private registeredControls: Partial<
    Record<ControlNames, FormControl<unknown>>
  > = {};

  /**
   * Registers form controls for later reactive access.
   */
  public registerControls(
    form: FormGroup,
    controlNames: readonly ControlNames[],
  ): void {
    controlNames.forEach((controlName) => {
      const control = getControl(controlName.replace(/_/g, '.'), form);

      if (!control) {
        throw new Error(
          `Failed to register control "${controlName}". Available controls: ${Object.keys(form.controls).join(', ')}`,
        );
      }

      this.registeredControls[controlName] = control;
    });
  }

  public valueChangesOf<T>(key: ControlNames): Observable<T> {
    const control = this.registeredControls[key];

    if (!control) {
      throw new Error(
        `Control with name: "${key}" not found. Ensure it is registered in registerControls(...) before usage.`,
      );
    }

    return control.valueChanges as Observable<T>;
  }
}
