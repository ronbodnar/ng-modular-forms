import { FormGroup, Validators } from '@angular/forms';
import { FormHandlerBase } from '@ng-modular-forms/core';
import { Subscription } from 'rxjs';

export class MultiSectionFormHandler extends FormHandlerBase {
  getReactiveLogic(form?: FormGroup): Subscription {
    const subscription = new Subscription();

    // Register controls for reactive access
    this.registerControls(form!, [
      'personalInfo.firstName',
      'personalInfo.lastName',
      'personalInfo.email',
      'personalInfo.phone',
      'personalInfo.dateOfBirth',
      'personalInfo.gender',
      'address.streetAddress',
      'address.city',
      'address.state',
      'address.zipCode',
      'address.country',
      'payment.paymentMethod',
      'payment.cardNumber',
      'payment.expiryMonth',
      'payment.expiryYear',
      'payment.cvv',
      'payment.billingAmount',
    ]);

    // Business logic: Validate billing amount based on country
    subscription.add(
      this.valueChangesOf<string>('address.country').subscribe((country) => {
        const billingAmountControl =
          this.registeredControls['payment.billingAmount'];

        if (country === 'us') {
          // US customers can have higher limits
          billingAmountControl.setValidators([
            Validators.required,
            Validators.min(0.01),
            Validators.max(10000),
          ]);
        } else {
          // International customers have lower limits
          billingAmountControl.setValidators([
            Validators.required,
            Validators.min(0.01),
            Validators.max(5000),
          ]);
        }

        billingAmountControl.updateValueAndValidity();
      }),
    );

    // Business logic: Auto-format phone number based on country
    subscription.add(
      this.valueChangesOf<string>('address.country').subscribe((country) => {
        const phoneControl = this.registeredControls['personalInfo.phone'];

        if (country === 'us') {
          phoneControl.setValidators([
            Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/),
          ]);
        } else if (country === 'uk') {
          phoneControl.setValidators([
            Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/),
          ]);
        } else {
          phoneControl.setValidators([
            Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/),
          ]);
        }

        phoneControl.updateValueAndValidity();
      }),
    );

    // Business logic: Payment method affects validation
    subscription.add(
      this.valueChangesOf<string>('payment.paymentMethod').subscribe(
        (method) => {
          const cardNumberControl =
            this.registeredControls['payment.cardNumber'];
          const cvvControl = this.registeredControls['payment.cvv'];

          if (method) {
            // Enable card validation when payment method is selected
            cardNumberControl.enable();
            cvvControl.enable();
          } else {
            cardNumberControl.disable();
            cvvControl.disable();
          }
        },
      ),
    );

    return subscription;
  }
}
