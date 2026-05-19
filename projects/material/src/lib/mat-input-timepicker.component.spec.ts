import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { MatInputTimepickerComponent } from './mat-input-timepicker.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputTimepickerComponent,
    MatNativeDateModule,
  ],
  template: `
    <form [formGroup]="form">
      <nmf-mat-timepicker formControlName="field" [loading]="loading" />
    </form>
  `,
})
class TimepickerHostComponent {
  form = new FormGroup({ field: new FormControl(null, Validators.required) });
  loading = false;
}

describe('MatInputTimepickerComponent', () => {
  let fixture: ComponentFixture<TimepickerHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimepickerHostComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TimepickerHostComponent);
    fixture.detectChanges();
  });

  it('has the default placeholder', () => {
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;
    expect(input.placeholder).toBe('Select a time');
  });

  it('hides the toggle and shows spinner when loading', () => {
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    const toggle = fixture.debugElement.query(By.css('mat-timepicker-toggle'));
    expect(toggle?.nativeElement.hasAttribute('hidden')).toBe(true);

    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).not.toBeNull();
  });

  it('renders a required error once the control is touched and invalid', () => {
    fixture.componentInstance.form.get('field')?.setErrors({ required: true });
    fixture.componentInstance.form.get('field')?.markAsTouched();
    fixture.componentInstance.form.get('field')?.updateValueAndValidity();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('mat-error')?.textContent.trim(),
    ).toBe('This field is required');
  });
});
