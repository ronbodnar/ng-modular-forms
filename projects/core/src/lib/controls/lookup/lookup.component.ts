import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { FormControlBase } from '../../base/form-control-base';
import { LookupOption, LookupStatus } from './lookup.types';
import { FormFieldComponent } from '../form-field/form-field.component';
import { LookupBehavior } from '../../behavior/lookup/lookup.behavior';

@Component({
  selector: 'nmf-lookup',
  exportAs: 'nmfLookup',
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nmf-form-field
      [label]="translatedLabel()"
      [hintLabel]="status() === 'empty' ? translatedEmptyOptionsLabel() : null"
      [hintClassList]="hintClassList()"
      [isRequired]="isRequired()"
      [loading]="status() === 'loading' || loading()"
      [errorMessage]="translatedErrorMessage()"
    >
      <div
        class="nmf-control-wrapper"
        [class.error]="hasErrors()"
        [class.disabled]="disabled()"
      >
        @if (behavior.filteredOptions | async; as options) {
          <input
            #focusable
            type="text"
            class="nmf-control"
            [attr.list]="id + '-options'"
            [ngClass]="classList()"
            [style.cursor]="!isOptionSelected(null) ? 'not-allowed' : 'text'"
            [id]="id()"
            [name]="name()"
            [value]="displayLabel()"
            [disabled]="disabled()"
            [required]="isRequired()"
            [readonly]="!isOptionSelected(null)"
            [placeholder]="translatedPlaceholder()"
            [autocomplete]="autocompleteAttr()"
            (blur)="onFocusOut()"
            (focus)="onFocusIn()"
            (input)="onInput($event)"
            (keydown)="onKeyDown($event, options)"
          />

          @if (isOpen() && options && options.length > 0) {
            <ul
              class="nmf-options-list"
              [class.upward]="openUpwards()"
              (pointerdown)="setOptionsInteraction(true)"
              (pointerup)="setOptionsInteraction(false)"
            >
              @for (option of options; track option; let i = $index) {
                <li
                  [class.selected]="isOptionSelected(option.value)"
                  [class.active]="activeIndex() === i"
                  (click)="selectOption($event, option)"
                >
                  {{
                    displayWith() ? displayWith()!(option.value) : option.label
                  }}
                </li>
              }
            </ul>
          }

          @if (!isOptionSelected(null) && !disabled()) {
            <button
              class="nmf-clear-button"
              type="button"
              aria-label="Clear selection"
              (click)="clearSelectedOption()"
            >
              X
            </button>
          }
        }
      </div>
    </nmf-form-field>
  `,
})
export class InputLookupComponent<TOption>
  extends FormControlBase<TOption>
  implements OnDestroy
{
  override readonly autocompleteAttr = input<string | null>('off');

  /*
   * Static options to display in the dropdown. This is for synchronous sources.
   */
  optionsSource = input<LookupOption<TOption>[]>([]);

  /*
   * Must return a cancellable observable. This is for asynchronous sources (API calls, etc).
   */
  optionsProvider =
    input<(query: string | null) => Observable<LookupOption<TOption>[]>>();

  /*
   * When using a synchronous options source, or an asynchronous provider that returns an object where the shape is known,
   * this function is used to determine the display value.
   */
  displayWith = input<(value: TOption | null) => string>();

  /*
   * Used to determine the display value asynchronously when using primitive types for form values
   * eg: countryCode instead of Country itself.
   *
   * If not provided, the raw value will be used. Only needed for patching/hydrating the form.
   */
  displayProvider = input<(value: TOption | null) => Observable<string>>();

  /*
   * Used to compare options during selection if object equality is not sufficient.
   */
  compareWith = input<(a: TOption, b: TOption) => boolean>();

  /*
   * The provided hint label will be displayed when asynchronous lookup is empty.
   */
  emptyOptionsLabel = input<string>('No results found');

  /*
   * Search will be debounced by this many milliseconds.
   */
  debounceTime = input<number>(500);

  /*
   * Search will not be triggered until the user has typed at least this many characters.
   */
  searchThreshold = input<number>(2);

  protected behavior: LookupBehavior<TOption>;

  private readonly _activeIndex = signal(-1);

  public readonly activeIndex = this._activeIndex.asReadonly();

  private readonly _searchQuery = signal('');
  private readonly _isInteractingWithOptions = signal(false);

  private readonly _searchQuery$ = toObservable(this._searchQuery);

  readonly isOpen = signal(false);
  readonly openUpwards = signal(false);

  readonly translatedEmptyOptionsLabel = computed(() =>
    this.translate(this.emptyOptionsLabel()),
  );

  public readonly displayLabel = computed(() => {
    const selected = this.behavior.selectedOption();
    if (selected) {
      return selected.label;
    }
    return this._searchQuery();
  });

  readonly status = computed(() => this.behavior.status());

  inputElement = inject(ElementRef<HTMLInputElement>);

  constructor() {
    super();

    this.behavior = new LookupBehavior<TOption>({
      destroyRef: this.destroyRef,
      resolvers: {
        compare: this.compareWith,
        label: this.displayWith,
        labelAsync: this.displayProvider,
        search: this.optionsProvider,
      },
    });

    effect(() => {
      const currentOptions = this.optionsSource() ?? [];
      this.updateOptions(currentOptions);
    });

    effect(() => {
      const selectedOption = this.behavior.selectedOption();
      this.onChange(selectedOption?.value ?? null);
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.behavior.setupFilteredOptions(this._searchQuery$, this._searchQuery);
    this.behavior.setupOptionsProvider(
      this._searchQuery$,
      this.debounceTime(),
      this.searchThreshold(),
    );
  }

  override writeValue(value: TOption | null): void {
    super.writeValue(value);
    this.behavior.selectedMatchedOption(value);
  }

  override onFocusOut(): void {
    super.onFocusOut();

    if (this._isInteractingWithOptions()) {
      return;
    }

    this.isOpen.set(false);
  }

  override onFocusIn(): void {
    super.onFocusIn();
    if (!this.behavior.selectedOption()) {
      this.calculateDropdownPosition();
      this.isOpen.set(true);
    }
  }

  ngOnDestroy(): void {
    this.behavior.optionsUpdated$.complete();
  }

  onInput(event: Event): void {
    this._searchQuery.set((event.target as HTMLInputElement).value);
  }

  selectOption(event: Event, option: LookupOption<TOption>): void {
    this.behavior.selectOption(event, option);

    this._isInteractingWithOptions.set(false);
    this.isOpen.set(false);
  }

  updateOptions(results: LookupOption<TOption>[], status?: LookupStatus): void {
    this.behavior.updateOptions(results, status);
    this.resetActiveIndex();
  }

  clearSelectedOption(): void {
    this._searchQuery.set('');
    this.behavior.clearSelectedOption();
    this.focus();
  }

  isOptionSelected(value: TOption | null): boolean {
    return this.behavior.isOptionSelected(value);
  }

  resetActiveIndex(): void {
    this._activeIndex.set(-1);
  }

  setOptionsInteraction(state: boolean): void {
    this._isInteractingWithOptions.set(state);
  }

  onKeyDown(
    event: KeyboardEvent,
    currentOptions: LookupOption<TOption>[] | null,
  ): void {
    if (!this.isOpen() || !currentOptions || currentOptions.length === 0) {
      if (event.key === 'ArrowDown') {
        this.calculateDropdownPosition();
        this.isOpen.set(true);
        event.preventDefault();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this._activeIndex.update((prev) =>
          prev + 1 >= currentOptions.length ? 0 : prev + 1,
        );
        break;

      case 'ArrowUp':
        event.preventDefault();
        this._activeIndex.update((prev) =>
          prev - 1 < 0 ? currentOptions.length - 1 : prev - 1,
        );
        break;

      case 'Enter':
        event.preventDefault();
        if (
          this._activeIndex() >= 0 &&
          this._activeIndex() < currentOptions.length
        ) {
          this.selectOption(event, currentOptions[this._activeIndex()]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.isOpen.set(false);
        this.resetActiveIndex();
        break;

      case 'Backspace':
      case 'Delete':
        if (this.behavior.selectedOption() !== null) {
          event.preventDefault();
          this.clearSelectedOption();
        }
        break;
    }
  }

  private calculateDropdownPosition(): void {
    const rect = this.inputElement.nativeElement.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    this.openUpwards.set(spaceBelow < 225 && spaceAbove > spaceBelow);
  }
}
