import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormSectionComponent } from './form-section.component';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [FormSectionComponent],
  template: `
    <app-form-section [title]="title">
      <div data-testid="projected">Hello Content</div>
    </app-form-section>
  `,
})
class HostComponent {
  title = 'Test Title';
}

describe('FormSectionComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  const text = () => fixture.nativeElement.textContent as string;

  it('renders the provided title', () => {
    expect(text()).toContain('Test Title');
  });

  it('reacts to title changes', () => {
    fixture.componentInstance.title = 'Updated Title';
    fixture.detectChanges();

    expect(text()).toContain('Updated Title');
  });

  it('renders projected content', () => {
    const projected = fixture.debugElement.query(
      By.css('[data-testid="projected"]'),
    );

    expect(projected).toBeTruthy();
    expect(projected.nativeElement.textContent).toContain('Hello Content');
  });
});
