import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { InputDatepickerComponent } from './input-datepicker.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InputDatepickerComponent],
  template: `
    <form [formGroup]="form">
      <nmf-datepicker
        formControlName="date"
        [minDate]="minDate"
        [maxDate]="maxDate"
        [disabledOverride]="disabled"
      />
    </form>
  `,
})
class HostComponent {
  disabled = false;
  minDate = new Date(2024, 0, 1);
  maxDate = new Date(2024, 11, 31);

  form = new FormGroup({
    date: new FormControl<Date | null>(null),
  });
}

describe('InputDatepickerComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: InputDatepickerComponent;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const debug = fixture.debugElement.query(
      By.directive(InputDatepickerComponent),
    );

    component = debug.componentInstance;

    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('formats and writes value via writeValue', () => {
    const date = new Date(2025, 0, 15);

    component.writeValue(date);
    fixture.detectChanges();

    expect(input.value).toBe('2025-01-15');
  });

  it('parses input date string and emits Date via onChange', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);

    input.value = '2025-01-15';
    input.dispatchEvent(new Event('input'));

    expect(onChange).toHaveBeenCalled();

    const arg = onChange.mock.calls[0][0] as Date;

    expect(arg instanceof Date).toBe(true);
    expect(arg.getFullYear()).toBe(2025);
    expect(arg.getMonth()).toBe(0);
    expect(arg.getDate()).toBe(15);
  });

  it('sets displayValue when writing value', () => {
    const date = new Date(2025, 5, 10);

    component.writeValue(date);
    fixture.detectChanges();

    expect(component.displayValue()).toBe('2025-06-10');
  });

  it('respects min and max attributes', () => {
    expect(input.min).toBe('2024-01-01');
    expect(input.max).toBe('2024-12-31');
  });

  it('sets displayValue empty when null is written', () => {
    component.writeValue(null);
    fixture.detectChanges();

    expect(component.displayValue()).toBe('');
  });

  it('does not emit when disabled by input flag', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    input.value = '2025-01-01';
    input.dispatchEvent(new Event('input'));

    expect(onChange).not.toHaveBeenCalled();
  });
});
