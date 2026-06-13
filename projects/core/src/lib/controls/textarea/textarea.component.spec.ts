import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputTextareaComponent } from './textarea.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InputTextareaComponent],
  template: `
    <form [formGroup]="form">
      <nmf-textarea formControlName="notes" [rows]="rows" [cols]="cols" />
    </form>
  `,
})
class HostComponent {
  rows = 4;
  cols = 20;

  form = new FormGroup({
    notes: new FormControl('', Validators.required),
  });
}

describe('InputTextareaComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('binds rows and cols', () => {
    const textarea: HTMLTextAreaElement = fixture.debugElement.query(
      By.css('textarea'),
    ).nativeElement;

    expect(textarea.rows).toBe(4);
    expect(textarea.cols).toBe(20);
  });

  it('shows required error when touched', () => {
    const control = fixture.componentInstance.form.get('notes')!;
    control.markAsTouched();

    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.nmf-hint.error');
    expect(error?.textContent.trim()).toBe('This field is required');
  });
});
