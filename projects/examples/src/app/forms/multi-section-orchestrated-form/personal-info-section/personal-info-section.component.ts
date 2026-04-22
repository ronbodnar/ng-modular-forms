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
  MatInputDatepickerComponent,
} from '@ng-modular-forms/material';

@Component({
  selector: 'app-personal-info-section',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputTextComponent,
    MatInputSelectComponent,
    MatInputDatepickerComponent,
  ],
  templateUrl: './personal-info-section.component.html',
  styleUrl: './personal-info-section.component.css',
})
export class PersonalInfoSectionComponent {
  @Output() formReady = new EventEmitter<FormGroup>();

  form = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]),
    dateOfBirth: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
  });

  genders = [
    { key: 'male', label: 'Male' },
    { key: 'female', label: 'Female' },
    { key: 'other', label: 'Other' },
    { key: 'prefer-not-to-say', label: 'Prefer not to say' },
  ];

  ngOnInit() {
    // Emit the form when component initializes
    this.formReady.emit(this.form);
  }
}
