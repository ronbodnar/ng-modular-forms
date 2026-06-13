import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputCurrencyComponent } from './currency.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InputCurrencyComponent],
  template: `
    <form [formGroup]="form">
      <nmf-currency formControlName="amount" [disabledOverride]="disabled" />
    </form>
  `,
})
class HostComponent {
  disabled = false;

  form = new FormGroup({
    amount: new FormControl<number | null>(null),
  });
}

describe('InputCurrencyComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let component: InputCurrencyComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    component = fixture.debugElement.query(
      By.directive(InputCurrencyComponent),
    ).componentInstance;
  });

  it('formats negative values correctly', () => {
    component.writeValue(-1234);

    fixture.detectChanges();

    expect(component.displayValue()).toContain('-1,234');
  });

  it('does not emit when disabled', () => {
    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    const onChange = vi.fn();
    component.registerOnChange(onChange);

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    input.value = '1234';
    input.dispatchEvent(new Event('input'));

    expect(onChange).not.toHaveBeenCalled();
  });
});
