import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { InputTimepickerComponent } from './timepicker.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InputTimepickerComponent],
  template: `
    <form [formGroup]="form">
      <nmf-timepicker
        formControlName="time"
        [step]="step"
        [disabledOverride]="disabledOverride"
      />
    </form>
  `,
})
class HostComponent {
  step = 60;
  disabledOverride = false;
  form = new FormGroup({
    time: new FormControl<Date | null>(null),
  });
}

describe('InputTimepickerComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: InputTimepickerComponent;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const debug = fixture.debugElement.query(
      By.directive(InputTimepickerComponent),
    );

    component = debug.componentInstance;

    input = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('formats time as HH:mm when step >= 60', () => {
    const date = new Date(2025, 0, 1, 14, 30, 45);

    component.writeValue(date);
    fixture.detectChanges();

    expect(input.value).toBe('14:30');
    expect(component.displayValue()).toBe('14:30');
  });

  it('formats time as HH:mm:ss when step < 60', () => {
    fixture.componentInstance.step = 1;
    fixture.detectChanges();

    const date = new Date(2025, 0, 1, 9, 5, 7);

    component.writeValue(date);
    fixture.detectChanges();

    expect(input.value).toBe('09:05:07');
    expect(component.displayValue()).toBe('09:05:07');
  });

  it('parses input value and emits Date via onChange', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);

    input.value = '12:45';
    input.dispatchEvent(new Event('input'));

    expect(onChange).toHaveBeenCalled();

    const emitted = onChange.mock.calls[0][0] as Date;

    expect(emitted instanceof Date).toBe(true);
    expect(emitted.getHours()).toBe(12);
    expect(emitted.getMinutes()).toBe(45);
  });

  it('handles seconds when step < 60', () => {
    fixture.componentInstance.step = 1;
    fixture.detectChanges();

    const onChange = vi.fn();
    component.registerOnChange(onChange);

    input.value = '10:20:30';
    input.dispatchEvent(new Event('input'));

    const emitted = onChange.mock.calls[0][0] as Date;

    expect(emitted.getHours()).toBe(10);
    expect(emitted.getMinutes()).toBe(20);
    expect(emitted.getSeconds()).toBe(30);
  });

  it('updates displayValue on input', () => {
    component.registerOnChange(() => {});

    input.value = '08:15';
    input.dispatchEvent(new Event('input'));

    expect(component.displayValue()).toBe('08:15');
  });

  it('does not emit when disabled by input flag', () => {
    const onChange = vi.fn();
    component.registerOnChange(onChange);

    fixture.componentInstance.disabledOverride = true;
    fixture.detectChanges();

    input.value = '10:00';
    input.dispatchEvent(new Event('input'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('writes null safely', () => {
    component.writeValue(null);
    fixture.detectChanges();

    expect(input.value).toBe('');
    expect(component.displayValue()).toBe('');
  });
});
