import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormHandlerBase, getControl } from '@ng-modular-forms/core';

const CONTROL_NAMES = [
  'preferences.agreeToTerms',
  'preferences.referralSource',
] as const;

type ControlNames = (typeof CONTROL_NAMES)[number];

@Injectable()
export class PreferencesFormHandler extends FormHandlerBase<ControlNames> {
  override getReactiveLogic(form?: FormGroup) {
    if (!form) {
      throw new Error('PreferencesFormHandler requires a form instance');
    }

    this.registerControls(form, [
      'preferences.agreeToTerms',
      'preferences.referralSource',
    ]);

    return this.valueChangesOf<boolean>('preferences.agreeToTerms').subscribe(
      (newsletter) => {
        const referralControl = getControl('preferences.referralSource', form);

        if (newsletter) {
          referralControl.setValidators([Validators.required]);
        } else {
          referralControl.clearValidators();
        }

        console.log(
          'Updatin ctrl',
          referralControl.hasValidator(Validators.required),
        );

        referralControl.updateValueAndValidity();
      },
    );
  }
}
