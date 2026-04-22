import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { RegistrationFormComponent } from './registration-form.component';

describe('RegistrationFormComponent', () => {
  let component: RegistrationFormComponent;
  let fixture: ComponentFixture<RegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    const form = component.form();
    expect(form.contains('firstName')).toBeTruthy();
    expect(form.contains('lastName')).toBeTruthy();
    expect(form.contains('email')).toBeTruthy();
    expect(form.contains('country')).toBeTruthy();
    expect(form.contains('agreeToTerms')).toBeTruthy();
  });

  it('should validate required fields', () => {
    const form = component.form();
    form.markAllAsTouched();
    expect(form.valid).toBeFalsy();
  });
});
