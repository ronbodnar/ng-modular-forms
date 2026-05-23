import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHandlerBase } from '@ng-modular-forms/core';

type Controls = {
  'personalInfo.email': FormControl<string>;
  'preferences.agreeToTerms': FormControl<boolean>;
};

@Injectable()
export class MultiStepFormHandler extends FormHandlerBase<Controls> {
  override getReactiveLogic(form?: FormGroup) {
    if (!form) {
      throw new Error('RegistrationFormHandler requires a form instance');
    }

    this.initializeForm(form);

    const emailControl = this.getControl('personalInfo.email');

    return this.valueChangesOf('preferences.agreeToTerms').subscribe(
      (acceptedTerms) => {
        // Cross-group compliance rule:
        // Email becomes required only when user opts into agreement flow
        const validators = acceptedTerms
          ? [Validators.required, Validators.email]
          : [Validators.email];

        emailControl.setValidators(validators);
        emailControl.updateValueAndValidity({ emitEvent: false });
      },
    );
  }
}
