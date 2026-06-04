import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  signal,
  SimpleChanges,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormControlBase } from '../mat-form-control-base';
import { MatButtonModule } from '@angular/material/button';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  distinctUntilChanged,
  debounceTime,
  tap,
  filter,
  switchMap,
  catchError,
  of,
  Observable,
  startWith,
  map,
  Subject,
  merge,
  take,
  EMPTY,
} from 'rxjs';

type LookupStatus = 'default' | 'loading' | 'error' | 'empty';

export interface LookupOption<TResult> {
  value: TResult;
  label: string;
}

@Component({
  selector: 'nmf-mat-lookup',
  exportAs: 'nmfMatLookup',
  imports: [
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (label() && detachLabel()) {
      <label class="font-medium text-base">{{ label() }}</label>
    }

    <div class="relative">
      <mat-form-field
        class="w-full"
        [appearance]="appearance()"
        [floatLabel]="shouldLabelFloat()"
      >
        @if (label() && !detachLabel()) {
          <mat-label>{{ label() }}</mat-label>
        }

        <input
          matInput
          type="text"
          [class.cursor-not-allowed]="selectedOption() != null"
          [class.opacity-60]="selectedOption() != null"
          [attr.aria-label]="detachLabel() ? label() : null"
          [ngClass]="classList"
          [name]="name()"
          [required]="isRequired()"
          [readonly]="selectedOption() != null"
          [placeholder]="placeholder()"
          [formControl]="displayControl"
          [matAutocomplete]="auto"
          (blur)="onTouched()"
        />

        <mat-autocomplete
          #auto="matAutocomplete"
          [displayWith]="displayWith ?? null"
          (optionSelected)="selectOption($event)"
        >
          @for (option of filteredOptions | async; track option) {
            <mat-option [value]="option.value">{{ option.label }}</mat-option>
          }
        </mat-autocomplete>

        @if (status() === 'empty') {
          <mat-hint>{{ emptyOptionsLabel }}</mat-hint>
        } @else if (hint()) {
          <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
        }

        <mat-error>{{ errorMessage() }}</mat-error>

        <!-- Loading status is for lookups and async options, and loading() is for the form control itself -->
        @if (status() === 'loading' || loading()) {
          <mat-spinner
            matSuffix
            class="nmf-mat-loader"
            diameter="24"
            strokeWidth="3"
          />
        }

        @if (selectedOption()) {
          <button
            matSuffix
            mat-icon-button
            aria-label="Clear selection"
            (click)="clearSelectedOption()"
          >
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>
    </div>
  `,
})
export class MatInputLookupComponent<TOption>
  extends MatFormControlBase<TOption, string>
  implements OnChanges, OnDestroy
{
  @Input() optionsSource?: LookupOption<TOption>[] = [];
  @Input() defaultSelectedOption?: LookupOption<TOption>;

  /*
   * When using a synchronous options source, or a provider that returns an object, this function is used to determine the display value.
   */
  @Input() displayWith?: (value: TOption | null) => string;

  /*
   * Used to determine the display value asynchronously when using primitive types for form values (eg: countryCode instead of Country itself).
   * If not provided, the raw value will be used. Only needed for patching/hydrating the form.
   */
  @Input() displayProvider?: (value: TOption | null) => Observable<string>;

  /*
   * Must return a cancellable observable.
   */
  @Input() optionsProvider?: (
    query: string | null,
  ) => Observable<LookupOption<TOption>[]>;

  /*
   * Used to compare options during selection if object equality is not sufficient.
   */
  @Input() compareWith?: (a: TOption, b: TOption) => boolean;

  @Input() emptyOptionsLabel = 'No results found';
  @Input() debounceTime = 500;
  @Input() searchThreshold = 2;

  override readonly destroyRef = inject(DestroyRef);

  private _status = signal<LookupStatus>('default');
  private _options = signal<LookupOption<TOption>[]>([]);
  private _selectedOption = signal<LookupOption<TOption> | null>(null);

  public readonly status = this._status.asReadonly();
  public readonly options = this._options.asReadonly();
  public readonly selectedOption = this._selectedOption.asReadonly();

  private readonly _optionsUpdated$ = new Subject<void>();

  public filteredOptions!: Observable<LookupOption<TOption>[]>;

  override ngOnInit(): void {
    super.ngOnInit();

    this.setupFilteredOptions();
    this.setupOptionsProvider();
  }

  override writeValue(value: TOption | null): void {
    super.writeValue(value);

    const match =
      this._options().find((o) =>
        this.compareWith
          ? this.compareWith(o.value, value as TOption)
          : o.value === value,
      ) ?? null;

    if (match) {
      this._selectedOption.set(match);
      return;
    }

    if (value === null) {
      this._selectedOption.set(null);
      return;
    }

    if (this.displayProvider) {
      this._status.set('loading');

      this.displayProvider(value)
        .pipe(
          take(1),
          catchError(() => {
            this._status.set('error');
            return EMPTY;
          }),
        )
        .subscribe((label) => {
          this._selectedOption.set({
            value,
            label,
          });
          this._status.set('default');
        });
      return;
    }

    if (this.displayWith) {
      this._selectedOption.set({
        value: value as TOption,
        label: this.displayWith(value),
      });
      return;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['optionsSource']) {
      this.updateOptions(changes['optionsSource'].currentValue ?? []);
    }
    if (changes['defaultSelectedOption']) {
      const option: LookupOption<TOption> | undefined =
        changes['defaultSelectedOption'].currentValue;

      if (option) {
        this.displayControl.setValue(option.label, { emitEvent: false });

        this._selectedOption.set(option);
      }
    }
  }

  ngOnDestroy(): void {
    this._optionsUpdated$.complete();
  }

  selectOption(result: MatAutocompleteSelectedEvent): void {
    const selected = this._options().find((option) =>
      this.compareWith
        ? this.compareWith(option.value, result.option.value)
        : option.value === result.option.value,
    );
    if (!selected) {
      return;
    }

    this._selectedOption.set(selected);
    this.onChange(selected.value);
  }

  clearSelectedOption(): void {
    this.displayControl.setValue(null);
    this._selectedOption.set(null);
    this.onChange(null);
    if (this.optionsProvider) {
      this.updateOptions([]);
    }
  }

  private updateOptions(
    results: LookupOption<TOption>[],
    status?: LookupStatus,
  ): void {
    this._status.set(status ?? 'default');
    this._options.set(results);
    this._optionsUpdated$.next();
  }

  private filterOptions(
    name: string,
    results: LookupOption<TOption>[],
  ): LookupOption<TOption>[] {
    const filterValue = name.toLowerCase();
    return results.filter((option) =>
      option.label.toLowerCase().includes(filterValue),
    );
  }

  private setupFilteredOptions(): void {
    this.filteredOptions = merge(
      this.displayControl.valueChanges,
      this._optionsUpdated$,
    ).pipe(
      startWith(''),
      map(() => {
        const value = this.displayControl.value;
        const options = this.options();

        if (typeof value !== 'string') {
          return this.options().slice();
        }

        return value ? this.filterOptions(value, options) : options.slice();
      }),
    );
  }

  private setupOptionsProvider(): void {
    if (!this.optionsProvider) {
      return;
    }

    this.displayControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (
          typeof value !== 'object' &&
          (!value || value.length < this.searchThreshold)
        ) {
          this.updateOptions([]);
        }
      });

    this.displayControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged((a, b) => a === b),
        filter(() => this.selectedOption() == null),
        filter(
          (q): q is string =>
            typeof q === 'string' && q.length >= this.searchThreshold,
        ),
        tap(() => this.updateOptions([], 'loading')),
        switchMap((query) => {
          return (
            this.optionsProvider?.(query).pipe(
              catchError(() => {
                this._status.set('error');
                return of(null);
              }),
            ) ?? of([])
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        if (!response) {
          return;
        }
        const status = response.length ? 'default' : 'empty';
        this.updateOptions(response, status);
      });
  }
}
