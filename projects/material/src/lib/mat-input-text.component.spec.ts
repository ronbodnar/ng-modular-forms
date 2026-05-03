import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputTextComponent } from './mat-input-text.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach } from 'vitest';

describe('MatInputTextComponent', () => {
  let fixture: ComponentFixture<MatInputTextComponent>;
  let component: MatInputTextComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatInputTextComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatInputTextComponent);
    component = fixture.componentInstance;
  });

  it('uses text type for password when showPassword is true', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    expect(input.type).toBe('password');

    component.behavior.toggleShowPassword();
    fixture.detectChanges();

    expect(input.type).toBe('text');
  });

  it('hides password toggle when loading is true', () => {
    fixture.componentRef.setInput('type', 'password');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.nmf-password-toggle'));
    expect(button).toBeNull();
  });
});
