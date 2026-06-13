import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatInputTextComponent,
  MatInputSelectComponent,
  MatInputTextareaComponent,
  MatInputCurrencyComponent,
  MatInputTimepickerComponent,
  MatInputDatepickerComponent,
  MatInputNumberComponent,
  LookupOption,
  MatInputLookupComponent,
} from '@ng-modular-forms/material';
import type { SelectOption } from '@ng-modular-forms/core';
import { Observable, of, delay } from 'rxjs';

@Component({
  selector: 'app-material-inputs-example',
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputTextComponent,
    MatInputSelectComponent,
    MatInputTextareaComponent,
    MatInputCurrencyComponent,
    MatInputTimepickerComponent,
    MatInputDatepickerComponent,
    MatInputNumberComponent,
    MatInputLookupComponent,
  ],
  templateUrl: './material-inputs.component.html',
})
export class MaterialInputsExampleComponent {
  form = new FormGroup({
    text: new FormControl('', [Validators.required, Validators.minLength(3)]),
    number: new FormControl<number | null>(null, [
      Validators.required,
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
    select: new FormControl('', Validators.required),
    currency: new FormControl<number | null>(null, [Validators.min(0)]),
    textarea: new FormControl('', [
      Validators.maxLength(500),
      Validators.required,
    ]),
    date: new FormControl<Date | null>(null, Validators.required),
    time: new FormControl<Date | null>(null, Validators.required),
  });

  rawCountries: Country[] = [
    { code: 'us', name: 'United States' },
    { code: 'ca', name: 'Canada' },
    { code: 'uk', name: 'United Kingdom' },
    { code: 'de', name: 'Germany' },
    { code: 'fr', name: 'France' },
    { code: 'jp', name: 'Japan' },
  ];

  countrySelectOptions: SelectOption[] = this.rawCountries.map((c) => ({
    value: c.code,
    label: c.name,
  }));

  countryLookupOptions: LookupOption<string>[] = this.rawCountries.map((c) => ({
    value: c.code,
    label: c.name,
  }));

  displayCountry = (value: string | null): string => {
    if (value == null) {
      return '';
    }
    return (
      this.countryLookupOptions.find((c) => c.value === value)?.label ?? ''
    );
  };

  countryProvider = (
    query: string | null,
  ): Observable<LookupOption<Country>[]> => {
    if (query == null) {
      return of([]).pipe(delay(1000));
    }

    const countries = this.rawCountries.map((c) => ({
      value: c,
      label: c.name,
    }));

    return of(
      countries.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()),
      ),
    ).pipe(delay(1000));
  };

  displayCountryAsync = (value: Country | null): string => {
    if (value == null) {
      return '';
    }
    return value.name;
  };
}

interface Country {
  code: string;
  name: string;
}
