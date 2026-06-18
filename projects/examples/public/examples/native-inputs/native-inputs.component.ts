import { Component, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  InputCurrencyComponent,
  InputDatepickerComponent,
  InputLookupComponent,
  InputNumberComponent,
  InputSelectComponent,
  InputTextareaComponent,
  InputTextComponent,
  InputTimepickerComponent,
} from '@ng-modular-forms/core';
import type { LookupOption, SelectOption } from '@ng-modular-forms/core';
import { Observable, of, delay } from 'rxjs';

interface Country {
  code: string;
  name: string;
}

@Component({
  selector: 'app-native-inputs-example',
  imports: [
    ReactiveFormsModule,
    InputTextComponent,
    InputSelectComponent,
    InputTextareaComponent,
    InputLookupComponent,
    InputNumberComponent,
    InputCurrencyComponent,
    InputDatepickerComponent,
    InputTimepickerComponent,
  ],
  templateUrl: './native-inputs.component.html',
})
export class NativeInputsExampleComponent {
  loading = signal(false);

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
    date: new FormControl<Date | null>(null, Validators.required),
    time: new FormControl<Date | null>(null, Validators.required),
    select: new FormControl<string | null>(null, Validators.required),
    currency: new FormControl<number | null>(null, [Validators.min(0)]),
    textarea: new FormControl('', [Validators.maxLength(500)]),
    lookupSync: new FormControl<string | null>(null),
    lookupAsync: new FormControl<Country | null>(null),
    array: new FormArray<
      FormGroup<{
        text: FormControl<string | null>;
      }>
    >([]),
  });

  get arrayGroup(): FormGroup {
    return new FormGroup({
      text: new FormControl(''),
    });
  }

  get arrayControl(): FormArray {
    return this.form.get('array') as FormArray;
  }

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
