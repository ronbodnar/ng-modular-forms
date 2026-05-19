import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach } from 'vitest';

import { MatInputDatepickerComponent } from './mat-input-datepicker.component';
import {
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatInputDatepickerComponent],
  template: `
    <form [formGroup]="form">
      <nmf-mat-datepicker
        formControlName="field"
        [loading]="loading"
        [minDate]="min"
        [maxDate]="max"
      />
    </form>
  `,
})
class DatepickerHostComponent {
  loading = false;
  min: Date | null = null;
  max: Date | null = null;
  form = new FormGroup({ field: new FormControl(null, Validators.required) });
}

describe('MatInputDatepickerComponent', () => {
  let fixture: ComponentFixture<DatepickerHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerHostComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DatepickerHostComponent);
    fixture.detectChanges();
  });

  it('has the default placeholder and accepts min/max inputs', () => {
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    expect(input.placeholder).toBe('Select a date');

    const min = new Date(2000, 0, 1);
    const max = new Date(2030, 0, 1);
    fixture.componentInstance.min = min;
    fixture.componentInstance.max = max;
    fixture.detectChanges();

    // ensure min/max attributes are applied on the native input element
    expect(input.getAttribute('min')).toBeTruthy();
    expect(input.getAttribute('max')).toBeTruthy();
  });

  it('hides the toggle and shows a spinner when loading', () => {
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    const toggle = fixture.debugElement.query(By.css('mat-datepicker-toggle'));
    expect(toggle?.nativeElement.hasAttribute('hidden')).toBe(true);

    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).not.toBeNull();
  });

  it('renders a required error once the control is touched and invalid', () => {
    // set an error and ensure it renders through the host-backed control
    fixture.componentInstance.form.get('field')?.setErrors({ required: true });
    fixture.componentInstance.form.get('field')?.markAsTouched();
    fixture.componentInstance.form.get('field')?.updateValueAndValidity();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('mat-error')?.textContent.trim(),
    ).toBe('This field is required');
  });
});
