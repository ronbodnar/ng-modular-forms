import { Injectable } from '@angular/core';
import { FormHandlerBase, getControl } from '@ng-modular-forms/core';
import { FormGroup, Validators } from '@angular/forms';

const CONTROL_NAMES = [
  'personalInfo.newsletter',
  'personalInfo.email',
] as const;

type ControlNames = (typeof CONTROL_NAMES)[number];

@Injectable()
export class PersonalInfoFormHandler extends FormHandlerBase<ControlNames> {
  override getReactiveLogic(form?: FormGroup) {
    if (!form) {
      throw new Error('PersonalInfoFormHandler requires a form instance');
    }

    this.registerControls(form, [...CONTROL_NAMES]);

    return this.valueChangesOf<string>('personalInfo.newsletter').subscribe(
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
