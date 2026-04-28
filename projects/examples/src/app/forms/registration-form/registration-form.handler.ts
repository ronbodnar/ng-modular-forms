import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormHandlerBase, getControl } from '@ng-modular-forms/core';

@Injectable()
export class RegistrationFormHandler extends FormHandlerBase<
  'personalInfo.email' | 'preferences.agreeToTerms'
> {
  override getReactiveLogic(form?: FormGroup) {
    if (!form) {
      throw new Error('RegistrationFormHandler requires a form instance');
    }

    this.registerControls(form, [
      'personalInfo.email',
      'preferences.agreeToTerms',
    ]);

    return this.valueChangesOf<boolean>('preferences.agreeToTerms').subscribe(
      (newsletter) => {
        const emailControl = getControl('personalInfo.email', form);

        if (newsletter) {
          emailControl.setValidators([Validators.required, Validators.email]);
        } else {
          emailControl.setValidators([Validators.email]);
        }

        emailControl.updateValueAndValidity();
      },
    );
  }
}
