import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

import { FormFieldComponent } from './form-field.component';

@Component({
  standalone: true,
  imports: [FormFieldComponent],
  template: `
    <nmf-form-field
      [label]="label"
      [isRequired]="isRequired"
      [loading]="loading"
      [errorMessage]="errorMessage"
    >
      <div class="projected">content</div>
    </nmf-form-field>
  `,
})
class HostComponent {
  label: string | undefined = 'Label';
  isRequired = false;
  loading = false;
  errorMessage: string | null = null;
}

describe('FormFieldComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('renders label when provided', () => {
    const label = fixture.debugElement.query(By.css('.nmf-label'));
    expect(label.nativeElement.textContent).toContain('Label');
  });

  it('shows required asterisk when isRequired is true', () => {
    fixture.componentInstance.isRequired = true;
    fixture.detectChanges();

    const required = fixture.debugElement.query(By.css('.nmf-required'));
    expect(required).not.toBeNull();
    expect(required.nativeElement.textContent).toBe('*');
  });

  it('does not show label when label is empty', () => {
    fixture.componentInstance.label = undefined;
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.nmf-label'));
    expect(label).toBeNull();
  });

  it('renders error message when provided', () => {
    fixture.componentInstance.errorMessage = 'Something went wrong';
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('.nmf-hint.error'));
    expect(error.nativeElement.textContent).toContain('Something went wrong');
  });

  it('renders empty error paragraph when no error message', () => {
    const hint = fixture.debugElement.query(By.css('.nmf-hint'));
    expect(hint.nativeElement.textContent.trim()).toBe('');

    const error = fixture.debugElement.query(By.css('.nmf-hint.error'));
    expect(error).toBeNull();
  });

  it('shows loading spinner when loading is true', () => {
    fixture.componentInstance.loading = true;
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('.nmf-spinner'));
    expect(spinner).not.toBeNull();
  });

  it('does not show loading spinner when loading is false', () => {
    fixture.componentInstance.loading = false;
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('.nmf-spinner'));
    expect(spinner).toBeNull();
  });

  it('projects content correctly', () => {
    const projected = fixture.debugElement.query(By.css('.projected'));
    expect(projected.nativeElement.textContent).toBe('content');
  });
});
