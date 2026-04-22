import { Component, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormSectionComponent } from '../../shared/form-section/form-section.component';
import { FormExampleComponent } from '../../shared/form-example/form-example.component';
import { FormStatusOutputComponent } from '../../shared/form-status-output/form-status-output.component';
import {
  SelectOption,
  MatInputTextComponent,
  MatInputSelectComponent,
  MatInputTextareaComponent,
  MatInputCurrencyComponent,
  MatInputTimepickerComponent,
  MatInputDatepickerComponent,
} from '@ng-modular-forms/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-material-inputs-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputTextComponent,
    MatInputSelectComponent,
    MatInputTextareaComponent,
    MatInputCurrencyComponent,
    FormExampleComponent,
    FormSectionComponent,
    FormStatusOutputComponent,
    MatInputTimepickerComponent,
    MatInputDatepickerComponent,
  ],
  templateUrl: './material-inputs.component.html',
  styleUrl: './material-inputs.component.css',
})
export class MaterialInputsFormComponent implements OnInit {
  options = new FormGroup({
    appearance: new FormControl<'outline' | 'fill'>('outline'),
    loading: new FormControl(false),
    floatLabel: new FormControl<'auto' | 'always'>('auto'),
  });

  appearance = signal<'outline' | 'fill'>('outline');
  loading = signal(false);
  floatLabel = signal<'auto' | 'always'>('auto');

  form = new FormGroup({
    text: new FormControl('', [Validators.required, Validators.minLength(3)]),
    number: new FormControl<number | null>(null, [
      Validators.min(0),
      Validators.max(100),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    select: new FormControl('', Validators.required),
    currency: new FormControl<number | null>(null, [Validators.min(0)]),
    textarea: new FormControl('', [
      Validators.maxLength(500),
      Validators.required,
    ]),
    date: new FormControl<Date | null>(null),
    time: new FormControl<Date | null>(null),
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
      this.appearance.set(v.appearance ?? 'outline');
      this.loading.set(v.loading ?? false);
      this.floatLabel.set(v.floatLabel ?? 'auto');
    });
  }

  populateForm(): void {
    this.form.patchValue({
      text: 'Hello World',
      number: 123,
      password: '12345678',
      select: 'us',
      currency: 123,
      textarea: 'Hello\n\nWorld',
      date: new Date(),
      time: new Date(),
    });
  }
}
