import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputNumberComponent } from './input-number.component';
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
      />
    </form>
  `,
})
class HostComponent {
  formatValue = false;
  disabled = false;

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

  it('does not emit when disabled', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    input.value = '123';
    input.dispatchEvent(new Event('input'));

    expect(onChange).not.toHaveBeenCalled();
  });
});
