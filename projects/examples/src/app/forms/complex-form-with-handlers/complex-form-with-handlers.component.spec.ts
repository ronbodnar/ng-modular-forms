import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ComplexFormWithHandlersComponent } from './complex-form-with-handlers.component';

describe('ComplexFormWithHandlersComponent', () => {
  let component: ComplexFormWithHandlersComponent;
  let fixture: ComponentFixture<ComplexFormWithHandlersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplexFormWithHandlersComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ComplexFormWithHandlersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with required controls', () => {
    const form = component.form();
    expect(form.contains('employmentType')).toBeTruthy();
    expect(form.contains('monthlyIncome')).toBeTruthy();
    expect(form.contains('creditScore')).toBeTruthy();
  });

  it('should have handler logic', () => {
    expect(component.mainHandler()).toBeTruthy();
  });
});
