import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  InputCurrencyComponent,
  InputDatepickerComponent,
  InputSelectComponent,
  InputTextareaComponent,
  InputTextComponent,
  InputTimepickerComponent,
  SelectOption,
} from '@ng-modular-forms/input';
import { FormSectionComponent } from '../../shared/form-section/form-section.component';
import { FormExampleComponent } from '../../shared/form-example/form-example.component';
import { FormStatusOutputComponent } from '../../shared/form-status-output/form-status-output.component';

@Component({
  selector: 'app-basic-inputs-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent,
    InputSelectComponent,
    InputTextareaComponent,
    InputCurrencyComponent,
    InputDatepickerComponent,
    InputTimepickerComponent,
    FormExampleComponent,
    FormSectionComponent,
    FormStatusOutputComponent,
  ],
  templateUrl: './basic-inputs.component.html',
  styleUrl: './basic-inputs.component.css',
})
export class BasicInputsFormComponent {
  options = new FormGroup({
    loading: new FormControl(false),
    disabled: new FormControl(false),
  });

  loading = signal(false);

  form = new FormGroup({
    text: new FormControl('', [Validators.required, Validators.minLength(3)]),
    number: new FormControl<number | null>(null, [
      Validators.min(0),
      Validators.max(100),
    ]),
    numberFormatted: new FormControl<number | null>(null, [
      Validators.min(0),
      Validators.max(100),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    date: new FormControl<Date | null>(null),
    time: new FormControl<Date | null>(null, Validators.required),
    select: new FormControl('', Validators.required),
    currency: new FormControl<number | null>(null, [Validators.min(0)]),
    textarea: new FormControl('', [Validators.maxLength(500)]),
  });

  countries: SelectOption[] = [
    { key: 'us', label: 'United States' },
    { key: 'ca', label: 'Canada' },
    { key: 'uk', label: 'United Kingdom' },
    { key: 'de', label: 'Germany' },
    { key: 'fr', label: 'France' },
    { key: 'jp', label: 'Japan' },
  ];

  ngOnInit(): void {
    this.options.valueChanges.subscribe((v) => {
      this.loading.set(v.loading ?? false);
      if (v.disabled) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    });
  }

  populateForm(): void {
    this.form.patchValue({
      text: 'Hello World',
      number: 1230,
      numberFormatted: 1230,
      password: '12345678',
      select: 'us',
      currency: 1230,
      textarea: 'Hello\n\nWorld',
      date: new Date(),
      time: new Date(),
    });
  }
}
