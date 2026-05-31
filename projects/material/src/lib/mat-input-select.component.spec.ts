import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SelectOption } from '@ng-modular-forms/core';
import { MatInputSelectComponent } from './mat-input-select.component';
import { MatSelectChange } from '@angular/material/select';

describe('MatInputSelectComponent', () => {
  let fixture: ComponentFixture<MatInputSelectComponent>;
  let component: MatInputSelectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatInputSelectComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatInputSelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two', disabled: true },
    ] as SelectOption[]);
    fixture.componentRef.setInput('emptyOptionLabel', 'Select an option');
    fixture.detectChanges();
  });

  it('binds the empty option label and renders the correct number of options', () => {
    expect(component.emptyOptionLabel()).toBe('Select an option');
    expect(component.options().length).toBe(2);
  });

  it('reflects an externally written value in the display control via writeValue', () => {
    component.writeValue('one');
    fixture.detectChanges();

    expect(component.displayControl.value).toBe('one');
  });

  it('calls onChange with the selected value when selection changes', () => {
    const onChangeMock = vi.fn();
    component.registerOnChange(onChangeMock);

    component.onSelectionChange({ value: 'one' } as MatSelectChange);

    expect(onChangeMock).toHaveBeenCalledWith('one');
  });

  it('marks the disabled option correctly in the options list', () => {
    const disabledOption = component.options().find((o) => o.value === 'two');
    expect(disabledOption?.disabled).toBe(true);
  });

  it('does not call onChange when selection changes while disabled', () => {
    const onChangeMock = vi.fn();
    component.registerOnChange(onChangeMock);
    fixture.componentRef.setInput('disabledOverride', true);

    component.onSelectionChange({ value: 'one' } as MatSelectChange);

    expect(onChangeMock).not.toHaveBeenCalled();
  });
});
