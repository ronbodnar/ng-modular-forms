import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, it, expect, beforeEach } from 'vitest';

import { MatInputTextareaComponent } from './mat-input-textarea.component';

import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatInputTextareaComponent],
  template: `
    <form [formGroup]="form">
      <nmf-mat-textarea formControlName="notes" [rows]="rows" [cols]="cols" />
    </form>
  `,
})
class TextareaHostComponent {
  rows = 4;
  cols = 28;
  form = new FormGroup({ notes: new FormControl('', Validators.required) });
}

describe('MatInputTextareaComponent', () => {
  let fixture: ComponentFixture<TextareaHostComponent>;
  let component: MatInputTextareaComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaHostComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TextareaHostComponent);
    fixture.detectChanges();

    const debug = fixture.debugElement.query(
      By.directive(MatInputTextareaComponent),
    );
    component = debug.componentInstance;
  });

  it('binds rows and cols attributes from inputs', () => {
    const textarea = fixture.debugElement.query(By.css('textarea'))
      .nativeElement as HTMLTextAreaElement;

    expect(textarea.rows).toBe(4);
    expect(textarea.cols).toBe(28);
  });

  it('renders a required error message once the textarea is touched and invalid', () => {
    component.formControl.setErrors({ required: true });
    component.formControl.markAsTouched();
    component.formControl.updateValueAndValidity();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('mat-error')?.textContent.trim(),
    ).toBe('This field is required');
  });
});
