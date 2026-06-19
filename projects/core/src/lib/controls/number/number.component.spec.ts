import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputNumberComponent } from './number.component';
import { Mock } from 'vitest';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InputNumberComponent],
  template: `
    <form [formGroup]="form">
      <nmf-number
        formControlName="number"
        [formatValue]="formatValue"
        [disabledOverride]="disabled"
        [negativeColor]="negativeColor"
        [allowNegative]="allowNegative"
      />
    </form>
  `,
})
class HostComponent {
  formatValue = false;
  disabled = false;
  negativeColor: string | null = null;
  allowNegative = true;

  form = new FormGroup({
    number: new FormControl<number | null>(null),
  });
}

describe('InputNumberComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: InputNumberComponent;
  let input: HTMLInputElement;
  let onChange: Mock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    component = fixture.debugElement.query(
      By.directive(InputNumberComponent),
    ).componentInstance;

    input = fixture.debugElement.query(By.css('input')).nativeElement;

    onChange = vi.fn();
    component.registerOnChange(onChange);
  });

  it('parses formatted numeric input and emits value when formatValue is true', () => {
    fixture.componentInstance.formatValue = true;
    fixture.detectChanges();

    input.value = '1,234';
    input.dispatchEvent(new Event('input'));

    expect(onChange).toHaveBeenCalledWith(1234);
  });

  it('does not allow negative values when allowNegative is false', () => {
    fixture.componentInstance.allowNegative = false;
    fixture.detectChanges();

    input.value = '-123';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component.displayValue()).toContain('123');
  });

  it('allows negative values when allowNegative is true', () => {
    fixture.componentInstance.allowNegative = true;
    fixture.detectChanges();

    component.writeValue(-1234);

    fixture.detectChanges();

    expect(component.displayValue()).toContain('-1234');
  });

  it('applies negativeColor when value is negative', () => {
    fixture.componentInstance.negativeColor = 'red';
    fixture.detectChanges();

    component.writeValue(-123);

    fixture.detectChanges();

    expect(component.textColor()).toBe('red');
  });

  it('does not emit when disabled', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    input.value = '123';
    input.dispatchEvent(new Event('input'));

    expect(onChange).not.toHaveBeenCalled();
  });
});
