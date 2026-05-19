import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputTextComponent } from './input-text.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InputTextComponent],
  template: `
    <form [formGroup]="form">
      <nmf-text
        formControlName="text"
        label="Text"
        placeholder="Enter"
        [type]="type"
        [loading]="loading"
      />
    </form>
  `,
})
class HostComponent {
  type = 'text';
  loading = false;

  form = new FormGroup({
    text: new FormControl('', Validators.required),
  });
}

describe('InputTextComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('shows required error when touched and invalid', () => {
    const control = fixture.componentInstance.form.get('text')!;
    control.markAsTouched();

    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.nmf-error');
    expect(error?.textContent.trim()).toBe('This field is required');
  });

  it('toggles password visibility when password type is used', () => {
    fixture.componentInstance.type = 'password';
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.nmf-password-toggle'));

    expect(button).toBeTruthy();

    button.nativeElement.click();
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    expect(input.type).toBe('text');
  });

  it('writes value through CVA', () => {
    const component: InputTextComponent = fixture.debugElement.query(
      By.directive(InputTextComponent),
    ).componentInstance;

    component.writeValue('hello');

    const control = fixture.componentInstance.form.get('text')!;
    expect(control.value).toBe('hello');
  });
});
