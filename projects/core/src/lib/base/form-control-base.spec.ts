import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FormControlBase } from './form-control-base';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'test-form-control-base',
  imports: [ReactiveFormsModule],
  template: `
    <input
      #focusable
      [formControl]="control"
      [disabled]="disabled()"
      (focus)="onFocusIn()"
      (blur)="onFocusOut()"
    />

    <div class="error">{{ errorMessage() }}</div>
  `,
})
class TestControl extends FormControlBase<string | null> {}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TestControl],
  template: `
    <form [formGroup]="form">
      <test-form-control-base formControlName="field" />
    </form>
  `,
})
class HostComponent {
  form = new FormGroup({
    field: new FormControl('', Validators.required),
  });
}

describe('FormControlBase', () => {
  let fixture: ComponentFixture<HostComponent>;
  let control: FormControl<string | null>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    control = fixture.componentInstance.form.get('field') as FormControl<
      string | null
    >;
  });

  it('shows required error only after touch', () => {
    control.setValue('');
    control.markAsTouched();
    control.updateValueAndValidity();

    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('.error')).nativeElement;
    expect(error.textContent).toContain('This field is required');
  });

  it('returns custom string error message', () => {
    control.setErrors({ custom: 'Custom invalid' });
    control.markAsTouched();
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('.error')).nativeElement;
    expect(error.textContent).toContain('Custom invalid');
  });

  it('falls back to default error message for unknown errors', () => {
    control.setErrors({ unknown: true });
    control.markAsTouched();
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('.error')).nativeElement;
    expect(error.textContent).toContain('Invalid value');
  });

  it('disables input when CVA disabled state is set', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(input.disabled).toBe(false);

    control.disable();
    fixture.detectChanges();

    expect(input.disabled).toBe(true);
  });

  it('writes value through CVA', () => {
    fixture.componentInstance.form.get('field')!.setValue('hello');
    fixture.detectChanges();

    const component: TestControl = fixture.debugElement.query(
      By.directive(TestControl),
    ).componentInstance;

    expect(component.value).toBe('hello');
  });

  it('shows error only when touched + invalid', () => {
    control.setErrors({ minlength: { requiredLength: 5, actualLength: 1 } });

    expect(
      fixture.debugElement.query(By.css('.error')).nativeElement.textContent,
    ).toBe('');

    control.markAsTouched();
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.error')).nativeElement.textContent,
    ).toContain('Minimum length is 5');
  });

  it('should route focus and blur programmatically', () => {
    const debugElement = fixture.debugElement.query(By.directive(TestControl));
    const component: TestControl = debugElement.componentInstance;

    const focusSpy = vi.spyOn(component, 'focus');
    const blurSpy = vi.spyOn(component, 'blur');

    component.focus();
    expect(focusSpy).toHaveBeenCalled();

    component.blur();
    expect(blurSpy).toHaveBeenCalled();
  });
});
