import { Injectable } from '@angular/core';
import { FormHandlerBase, getControl } from '@ng-modular-forms/core';
import type { FormControl, FormGroup } from '@angular/forms';

type Controls = {
  'accountDetails.password': FormControl<string>;
  'accountDetails.confirmPassword': FormControl<string>;
};

@Injectable()
export class AccountDetailsFormHandler extends FormHandlerBase<Controls> {
  override getReactiveLogic(form?: FormGroup) {
    if (!form) {
      throw new Error('AccountDetailsFormHandler requires a form instance');
    }
    this.initializeForm(form);

    return this.valueChangesOf('accountDetails.password').subscribe(
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
