import { FormGroup, Validators } from '@angular/forms';
import { FormHandlerBase } from '@ng-modular-forms/core';
import { Subscription } from 'rxjs';

const CONTROL_NAMES = [
  'employmentType',
  'companyName',
  'jobTitle',
  'studentId',
  'universityName',
  'graduationYear',
  'hasDependents',
  'numberOfDependents',
  'monthlyIncome',
  'creditScore',
] as const;

type ControlNames = (typeof CONTROL_NAMES)[number];

export class ComplexFormHandler extends FormHandlerBase<ControlNames> {
  getReactiveLogic(form?: FormGroup): Subscription {
    const subscription = new Subscription();

    // Register controls for reactive access
    this.registerControls(form!, [...CONTROL_NAMES]);

    // Employment type logic
    subscription.add(
      this.valueChangesOf<string>('employmentType').subscribe(
        (employmentType) => {
          const companyNameControl = this.registeredControls['companyName'];
          const jobTitleControl = this.registeredControls['jobTitle'];
          const studentIdControl = this.registeredControls['studentId'];
          const universityNameControl =
            this.registeredControls['universityName'];
          const graduationYearControl =
            this.registeredControls['graduationYear'];

          if (employmentType === 'employed') {
            companyNameControl.enable();
            jobTitleControl.enable();
            studentIdControl.disable();
            universityNameControl.disable();
            graduationYearControl.disable();
          } else if (employmentType === 'student') {
            companyNameControl.disable();
            jobTitleControl.disable();
            studentIdControl.enable();
            universityNameControl.enable();
            graduationYearControl.enable();
          } else {
            companyNameControl.disable();
            jobTitleControl.disable();
            studentIdControl.disable();
            universityNameControl.disable();
            graduationYearControl.disable();
          }
        },
      ),
    );

    // Dependents logic
    subscription.add(
      this.valueChangesOf<boolean>('hasDependents').subscribe(
        (hasDependents) => {
          const numberOfDependentsControl =
            this.registeredControls['numberOfDependents'];

          if (hasDependents) {
            numberOfDependentsControl.enable();
          } else {
            numberOfDependentsControl.disable();
            numberOfDependentsControl.setValue(0);
          }
        },
      ),
    );

    // Credit score validation based on income
    subscription.add(
      this.valueChangesOf<number>('monthlyIncome').subscribe((income) => {
        const creditScoreControl = this.registeredControls['creditScore'];

        if (income > 10000) {
          // Higher income allows lower credit score minimum
          creditScoreControl.clearValidators();
        } else if (income > 5000) {
          // Medium income requires medium credit score
          creditScoreControl.setValidators([Validators.min(600)]);
        } else {
          // Lower income requires higher credit score
          creditScoreControl.setValidators([Validators.min(700)]);
        }

        creditScoreControl.updateValueAndValidity();
      }),
    );

    return subscription;
  }
}
