import { Injectable } from '@angular/core';
import { FormHandlerBase, getControl } from '@ng-modular-forms/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

type Controls = {
  'personalInfo.newsletter': FormControl<boolean>;
  'personalInfo.email': FormControl<string>;
};

@Injectable()
export class PersonalInfoFormHandler extends FormHandlerBase<Controls> {
  override getReactiveLogic(form?: FormGroup) {
    if (!form) {
      throw new Error('PersonalInfoFormHandler requires a form instance');
    }

    this.initializeForm(form);

    return this.valueChangesOf('personalInfo.newsletter').subscribe(
      (acceptedNewsletter) => {
        const emailControl = getControl('personalInfo.email', form);

        if (acceptedNewsletter) {
          emailControl.setValidators([Validators.required, Validators.email]);
        } else {
          emailControl.setValidators([Validators.email]);
        }

        emailControl.updateValueAndValidity();
      },
    );
  }
}
