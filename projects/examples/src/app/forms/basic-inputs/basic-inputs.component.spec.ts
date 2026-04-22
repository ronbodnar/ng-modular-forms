import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { BasicInputsFormComponent } from './basic-inputs.component';

describe('BasicInputsFormComponent', () => {
  let component: BasicInputsFormComponent;
  let fixture: ComponentFixture<BasicInputsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicInputsFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicInputsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    expect(component.form.contains('username')).toBeTruthy();
    expect(component.form.contains('email')).toBeTruthy();
    expect(component.form.contains('password')).toBeTruthy();
  });

  it('should validate password confirmation', () => {
    component.form.patchValue({
      password: 'password123',
      confirmPassword: 'different',
    });

    expect(
      component.form.get('confirmPassword')?.errors?.['passwordMismatch'],
    ).toBeTruthy();
  });
});
