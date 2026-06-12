import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { InputLookupComponent } from './lookup.component';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LookupOption } from './lookup.types';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

interface TestResult {
  id: number;
  name: string;
}

const TEST_OPTIONS: LookupOption<TestResult>[] = [
  { value: { id: 1, name: 'Alice' }, label: 'Alice' },
  { value: { id: 2, name: 'Bob' }, label: 'Bob' },
  { value: { id: 3, name: 'John' }, label: 'John' },
];

describe('InputLookupComponent', () => {
  let fixture: ComponentFixture<InputLookupComponent<TestResult>>;
  let component: InputLookupComponent<TestResult>;
  let mockNgControl: Partial<NgControl>;

  function typeSearch(value: string) {
    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    mockNgControl = {
      control: new FormControl<string>(''),
      valueAccessor: null,
    };

    await TestBed.configureTestingModule({
      imports: [
        InputLookupComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
      providers: [{ provide: NgControl, useValue: mockNgControl }],
    }).compileComponents();

    fixture = TestBed.createComponent(InputLookupComponent<TestResult>);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('optionsSource', TEST_OPTIONS);
    fixture.detectChanges();
  });

  it('does not commit the form value when the user types', () => {
    const onChangeMock = vi.fn();
    component.registerOnChange(onChangeMock);

    typeSearch('alice');

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('commits the form value only when an option is selected', () => {
    const onChangeMock = vi.fn();
    component.registerOnChange(onChangeMock);

    fixture.componentRef.setInput('optionsSource', TEST_OPTIONS);
    fixture.detectChanges();

    const event = new CustomEvent('click');
    const targetOption = TEST_OPTIONS[0];

    component.selectOption(event, targetOption);

    expect(onChangeMock).toHaveBeenCalledWith(targetOption.value);
    expect(component.behavior.selectedOption()).toEqual(targetOption);
  });

  it('does not call onChange when disabledOverride is set', () => {
    const onChangeMock = vi.fn();
    component.registerOnChange(onChangeMock);
    fixture.componentRef.setInput('disabledOverride', true);
    fixture.detectChanges();

    typeSearch('alice');

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('filters options by label (case-insensitive)', async () => {
    fixture.componentRef.setInput('optionsSource', TEST_OPTIONS);
    fixture.detectChanges();

    const emitted: (typeof TEST_OPTIONS)[] = [];
    component.behavior.filteredOptions.subscribe((v) => emitted.push(v));

    typeSearch('ali');
    await fixture.whenStable();

    expect(emitted[emitted.length - 1]).toHaveLength(1);
    expect(emitted[emitted.length - 1][0].label).toBe('Alice');
  });

  it('returns empty array when no options match the query', async () => {
    fixture.componentRef.setInput('optionsSource', TEST_OPTIONS);
    fixture.detectChanges();

    const emissions: (typeof TEST_OPTIONS)[] = [];
    const sub = component.behavior.filteredOptions.subscribe((opts) =>
      emissions.push(opts),
    );

    typeSearch('zzz');
    await fixture.whenStable();

    const finalEmission = emissions[emissions.length - 1];
    expect(finalEmission).toHaveLength(0);

    sub.unsubscribe();
  });

  it('sets error status when optionsProvider throws', async () => {
    vi.useFakeTimers();
    fixture.componentRef.setInput('optionsProvider', () =>
      throwError(() => new Error('network')),
    );
    component.ngOnInit();

    typeSearch('da');
    await vi.advanceTimersByTimeAsync(500);
    vi.useRealTimers();

    expect(component.behavior.status()).toBe('error');
  });

  it('calls optionsProvider and updates optionResults after debounce', async () => {
    vi.useFakeTimers();
    const providerOptions = [{ value: { id: 5, name: 'Dave' }, label: 'Dave' }];
    fixture.componentRef.setInput(
      'optionsProvider',
      vi.fn().mockReturnValue(of(providerOptions)),
    );
    component.ngOnInit();

    typeSearch('dav');
    await vi.advanceTimersByTimeAsync(500);
    vi.useRealTimers();

    expect(component.optionsProvider).toHaveBeenCalledWith('dav');
    expect(component.behavior.options()).toEqual(providerOptions);
  });

  it('does not call optionsProvider for single-character queries', async () => {
    vi.useFakeTimers();
    const providerMock = vi.fn().mockReturnValue(of([]));
    fixture.componentRef.setInput('optionsProvider', providerMock);
    component.ngOnInit();

    typeSearch('d');
    await vi.advanceTimersByTimeAsync(1000);
    vi.useRealTimers();

    expect(providerMock).not.toHaveBeenCalled();
  });

  it('updates optionResults when options input changes', () => {
    const newOptions = [{ value: { id: 99, name: 'Test' }, label: 'Test' }];

    fixture.componentRef.setInput('optionsSource', newOptions);
    fixture.detectChanges();

    expect(component.behavior.options()).toEqual(newOptions);
  });
});
