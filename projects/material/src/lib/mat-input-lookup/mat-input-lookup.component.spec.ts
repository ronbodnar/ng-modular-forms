import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  LookupOption,
  MatInputLookupComponent,
} from './mat-input-lookup.component';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

interface TestResult {
  id: number;
  name: string;
}

const TEST_OPTIONS: LookupOption<TestResult>[] = [
  { value: { id: 1, name: 'Alice' }, label: 'Alice' },
  { value: { id: 2, name: 'Bob' }, label: 'Bob' },
  { value: { id: 3, name: 'John' }, label: 'John' },
];

describe('MatInputLookupComponent', () => {
  let fixture: ComponentFixture<MatInputLookupComponent<TestResult>>;
  let component: MatInputLookupComponent<TestResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatInputLookupComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatInputLookupComponent<TestResult>);
    component = fixture.componentInstance;
    component.optionsSource = TEST_OPTIONS;
    fixture.detectChanges();
  });

  it('does not commit the form value when the user types', () => {
    const onChangeMock = vi.fn();
    component.registerOnChange(onChangeMock);

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    input.value = 'alice';
    input.dispatchEvent(new Event('input'));

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('commits the form value only when an option is selected', () => {
    const onChangeMock = vi.fn();
    component.registerOnChange(onChangeMock);

    // ngOnChanges is not called when setting properties directly,
    // so trigger it via setInput which goes through Angular's change detection
    fixture.componentRef.setInput('options', TEST_OPTIONS);
    fixture.detectChanges();

    component.selectOption({
      option: { value: TEST_OPTIONS[0].value },
    } as MatAutocompleteSelectedEvent);

    expect(onChangeMock).toHaveBeenCalledWith(TEST_OPTIONS[0].value);
  });

  it('does not call onChange when disabledOverride is set', () => {
    const onChangeMock = vi.fn();
    component.registerOnChange(onChangeMock);
    fixture.componentRef.setInput('disabledOverride', true);

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    input.value = 'alice';
    input.dispatchEvent(new Event('input'));

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('filters options by label (case-insensitive)', async () => {
    fixture.componentRef.setInput('options', TEST_OPTIONS);
    fixture.detectChanges();

    const emitted: (typeof TEST_OPTIONS)[] = [];
    component.filteredOptions.subscribe((v) => emitted.push(v));
    component.displayControl.setValue('ali');
    await fixture.whenStable();

    expect(emitted[emitted.length - 1]).toHaveLength(1);
    expect(emitted[emitted.length - 1][0].label).toBe('Alice');
  });

  it('returns empty array when no options match the query', async () => {
    const options: (typeof TEST_OPTIONS)[] = [];
    component.filteredOptions.subscribe((opts) => options.push(opts));

    component.displayControl.setValue('zzz');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(options[options.length - 1]).toHaveLength(0);
  });

  it('sets error status when optionsProvider throws', async () => {
    vi.useFakeTimers();
    component.optionsProvider = () => throwError(() => new Error('network'));
    component.ngOnInit();

    component.displayControl.setValue('da');
    await vi.advanceTimersByTimeAsync(1000);
    vi.useRealTimers();

    expect(component.status()).toBe('error');
  });

  it('calls optionsProvider and updates optionResults after debounce', async () => {
    vi.useFakeTimers();
    const providerOptions = [{ value: { id: 5, name: 'Dave' }, label: 'Dave' }];
    component.optionsProvider = vi.fn().mockReturnValue(of(providerOptions));
    component.ngOnInit();

    component.displayControl.setValue('da');
    await vi.advanceTimersByTimeAsync(1000);
    vi.useRealTimers();

    expect(component.optionsProvider).toHaveBeenCalledWith('da');
    expect(component.options()).toEqual(providerOptions);
  });

  it('does not call optionsProvider for single-character queries', async () => {
    vi.useFakeTimers();
    const providerMock = vi.fn().mockReturnValue(of([]));
    component.optionsProvider = providerMock;
    component.ngOnInit();

    component.displayControl.setValue('d');
    await vi.advanceTimersByTimeAsync(1000);
    vi.useRealTimers();

    expect(providerMock).not.toHaveBeenCalled();
  });

  it('updates optionResults when options input changes', () => {
    const newOptions = [{ value: { id: 99, name: 'Test' }, label: 'Test' }];
    component.ngOnChanges({
      options: {
        currentValue: newOptions,
        previousValue: TEST_OPTIONS,
        firstChange: false,
        isFirstChange: () => false,
      },
    });

    expect(component.options()).toEqual(newOptions);
  });
});
