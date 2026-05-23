import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormHandlerBase, getControl } from '@ng-modular-forms/core';

type Controls = {
  'preferences.agreeToTerms': FormControl<boolean>;
  'preferences.referralSource': FormControl<string>;
};

@Injectable()
export class PreferencesFormHandler extends FormHandlerBase<Controls> {
  override getReactiveLogic(form?: FormGroup) {
    if (!form) {
      throw new Error('PreferencesFormHandler requires a form instance');
    }

    this.initializeForm(form);

    return this.valueChangesOf('preferences.agreeToTerms').subscribe(
      (acceptedTerms) => {
        const referralControl = getControl('preferences.referralSource', form);

        if (acceptedTerms) {
          referralControl.setValidators([Validators.required]);
        } else {
          referralControl.clearValidators();
        }

        referralControl.updateValueAndValidity();
      },
    );
  }
}
