/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
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
} from 'rxjs';

type Statuses = 'default' | 'loading' | 'error' | 'empty';

interface AutocompleteOption<TResult> {
  value: TResult;
  label: string;
}

@Component({
  selector: 'nmf-mat-lookup',
  imports: [
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
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
          [ngClass]="classList"
          [name]="name()"
          [required]="isRequired()"
          [placeholder]="placeholder()"
          [formControl]="formControl"
          [matAutocomplete]="auto"
          (blur)="onTouched()"
        />

        <mat-autocomplete
          #auto="matAutocomplete"
          [requireSelection]="true"
          [displayWith]="displayWith ?? null"
          (optionSelected)="selectResult($event)"
        >
          @for (option of filteredOptions | async; track option) {
            <mat-option [value]="option.value">{{ option.label }}</mat-option>
          }
        </mat-autocomplete>

        @if (loading()) {
          <mat-spinner
            matSuffix
            class="nmf-mat-loader"
            diameter="22"
            strokeWidth="3"
          ></mat-spinner>
        }

        @if (empty) {
          <mat-hint>{{ 'searchEntity.noResults' }}</mat-hint>
        } @else if (hint()) {
          <mat-hint [ngClass]="hintClassList()">{{ hint() }}</mat-hint>
        }

        <ng-content></ng-content>

        <mat-error>{{ errorMessage() }}</mat-error>

        <div class="absolute top-2 right-2 z-10">
          @if (loadingResults) {
            <mat-spinner diameter="24" strokeWidth="3" />
          }
          @if (selectedItem) {
            <button mat-icon-button (clicked)="clearSelectedEntity()">
              <mat-icon>close</mat-icon>
            </button>
          }
        </div>
      </mat-form-field>
    </div>
  `,
})
export class MatInputLookupComponent<
  TResult,
> extends MatFormControlBase<string> {
  @Input() displayWith?: (value: AutocompleteOption<TResult> | null) => string;
  @Input() optionsProvider?: (
    query: string | null,
  ) => Observable<AutocompleteOption<TResult>[]>;

  @Input() options: AutocompleteOption<TResult>[] = [];

  override readonly destroyRef = inject(DestroyRef);

  private _selectedItem = signal<TResult | null>(null);
  private _searchResults = signal<AutocompleteOption<TResult>[]>(this.options);

  public readonly searchResults = this._searchResults.asReadonly();
  public readonly selectedEntity = this._selectedItem.asReadonly();
  public readonly filteredOptions: Observable<AutocompleteOption<TResult>[]>;

  constructor() {
    super();
    this.filteredOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      tap((value) => {
        console.log('filteredOptions', value);
      }),
      map((value) => {
        const name = value ?? '';
        return name ? this._filter(name) : this.options.slice();
      }),
    );
  }

  get selectedItem(): TResult | null {
    return null; //this.service.selectedEntity() as TResult | null;
  }

  clearSelectedEntity(): void {
    //this.entitySelected.emit(undefined);

    //this.service.setSelectedEntity(undefined);
    this.formControl.enable();
  }

  private status = signal<Statuses>('default');

  get loadingResults(): boolean {
    return this.status() === 'loading';
  }

  get error(): boolean {
    return this.status() === 'error';
  }

  get empty(): boolean {
    return this.status() === 'empty';
  }

  setStatus(status: Statuses): void {
    this.status.set(status);

    if (status === 'loading') {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Autocomplete changes', changes);
    if (changes['options']) {
      this._searchResults.set(changes['options'].currentValue);
    }
    if (changes['defaultSelectedEntity']) {
      /*       this.service.setSelectedEntity(
        changes['defaultSelectedEntity'].currentValue,
      ); */
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.formControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log('value', value);
      });

    this.ngControl?.valueChanges
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log('ngControl', value);
      });

    if (this.optionsProvider) {
      const valueChanges$ = this.formControl?.valueChanges;

      valueChanges$
        ?.pipe(
          distinctUntilChanged(),
          takeUntilDestroyed(),
          debounceTime(1000),
          //tap(() => this._searchResults.set([])),
          filter((query) => typeof query === 'string' && query.length > 1),
          tap(() => this.setStatus('loading')),
          switchMap((query) => this.optionsProvider?.(query) ?? of([])),
          catchError(() => {
            this.setStatus('error');
            return of(undefined);
          }),
        )
        .subscribe((response) => {
          if (!response) return;

          this._searchResults.set(response);
          //this.setStatus(response.content.length > 0 ? 'default' : 'empty');
        });
    }
  }

  selectResult(result: MatAutocompleteSelectedEvent): void {
    /*     const selectedEntity = this.service
      .searchResultsAsUser()
      .find((r) => r.id === result.option.value.id); */
    const selectedEntity = null;
    if (!selectedEntity) {
      console.warn('Selected entity not found', result);
      return;
    }
    //this.service.setSelectedEntity(selectedEntity);
    this.formControl.disable();

    this.clearSearchResults();
  }

  clearSearchResults(): void {
    //this.service.setSearchResults([]);
  }

  private _filter(name: string): AutocompleteOption<TResult>[] {
    const filterValue = name.toLowerCase();

    return this.options.filter((option) =>
      option.label.toLowerCase().includes(filterValue),
    );
  }
}
