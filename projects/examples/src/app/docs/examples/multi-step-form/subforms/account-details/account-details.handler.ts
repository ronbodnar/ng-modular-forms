import { Injectable } from '@angular/core';
import { FormHandlerBase, getControl } from '@ng-modular-forms/core';
import { FormGroup } from '@angular/forms';

const CONTROL_NAMES = [
  'accountDetails.password',
  'accountDetails.confirmPassword',
] as const;

type ControlNames = (typeof CONTROL_NAMES)[number];

@Injectable()
export class AccountDetailsFormHandler extends FormHandlerBase<ControlNames> {
  override getReactiveLogic(form?: FormGroup) {
    if (!form) {
      throw new Error('AccountDetailsFormHandler requires a form instance');
    }
    this.registerControls(form, [...CONTROL_NAMES]);

    return this.valueChangesOf<string>('accountDetails.password').subscribe(
      (password) => {
        const confirmControl = getControl(
          'accountDetails.confirmPassword',
          form,
        );
        const mismatch =
          password && confirmControl.value && confirmControl.value !== password;
        const errors = confirmControl.errors
          ? { ...confirmControl.errors }
          : {};

        if (mismatch) {
          errors['mismatch'] = true;
        } else {
          delete errors['mismatch'];
        }

        confirmControl.setErrors(Object.keys(errors).length ? errors : null);
      },
    );
  }
}
