import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  MatInputTextComponent,
  MatInputSelectComponent,
  MatInputCurrencyComponent,
} from '@ng-modular-forms/material';

@Component({
  selector: 'app-payment-section',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputTextComponent,
    MatInputSelectComponent,
    MatInputCurrencyComponent,
  ],
  templateUrl: './payment-section.component.html',
  styleUrl: './payment-section.component.css',
})
export class PaymentSectionComponent {
  @Output() formReady = new EventEmitter<FormGroup>();

  form = new FormGroup({
    paymentMethod: new FormControl('', Validators.required),
    cardNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/),
    ]),
    expiryMonth: new FormControl('', Validators.required),
    expiryYear: new FormControl('', Validators.required),
    cvv: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{3,4}$/),
    ]),
    billingAmount: new FormControl(0, [
      Validators.required,
      Validators.min(0.01),
    ]),
  });

  paymentMethods = [
    { key: 'credit', label: 'Credit Card' },
    { key: 'debit', label: 'Debit Card' },
  ];

  months = [
    { key: '01', label: 'January' },
    { key: '02', label: 'February' },
    { key: '03', label: 'March' },
    { key: '04', label: 'April' },
    { key: '05', label: 'May' },
    { key: '06', label: 'June' },
    { key: '07', label: 'July' },
    { key: '08', label: 'August' },
    { key: '09', label: 'September' },
    { key: '10', label: 'October' },
    { key: '11', label: 'November' },
    { key: '12', label: 'December' },
  ];

  years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { key: year.toString(), label: year.toString() };
  });

  ngOnInit() {
    this.formReady.emit(this.form);

    // Format card number as user types
    this.form.get('cardNumber')?.valueChanges.subscribe((value) => {
      if (value && typeof value === 'string') {
        const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const match = cleaned.match(/\d{1,4}/g);
        const formatted = match ? match.join(' ') : '';
        if (formatted !== value) {
          this.form
            .get('cardNumber')
            ?.setValue(formatted, { emitEvent: false });
        }
      }
    });
  }
}
