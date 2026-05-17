import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormHandlerBase, getControl } from '@ng-modular-forms/core';

const CONTROL_NAMES = [
  'personalInfo.email',
  'preferences.agreeToTerms',
] as const;

type ControlNames = (typeof CONTROL_NAMES)[number];

@Injectable()
export class MultiStepFormHandler extends FormHandlerBase<ControlNames> {
  override getReactiveLogic(form?: FormGroup) {
    if (!form) {
      throw new Error('RegistrationFormHandler requires a form instance');
    }

    this.registerControls(form, CONTROL_NAMES);

    const emailControl = getControl('personalInfo.email', form);

    return this.valueChangesOf<boolean>('preferences.agreeToTerms').subscribe(
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
