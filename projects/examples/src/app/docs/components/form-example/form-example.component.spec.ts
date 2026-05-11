import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormExampleComponent } from './form-example.component';

describe('FormExampleComponent', () => {
  let fixture: ComponentFixture<FormExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormExampleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormExampleComponent);
    fixture.detectChanges();
  });

  const text = () => fixture.nativeElement.textContent as string;

  it('renders title', () => {
    fixture.componentRef.setInput('title', 'My Example');
    fixture.detectChanges();

    expect(text()).toContain('My Example');
  });

  it('renders source link when provided', () => {
    fixture.componentRef.setInput('sourceUrl', 'https://github.com/test/repo');
    fixture.detectChanges();

    const a: HTMLAnchorElement | null =
      fixture.nativeElement.querySelector('a');

    expect(a).toBeTruthy();
    expect(a?.href).toContain('github.com/test/repo');
  });

  it('does not render source link when missing', () => {
    fixture.componentRef.setInput('sourceUrl', null);
    fixture.detectChanges();

    const a = fixture.nativeElement.querySelector('a');
    expect(a).toBeFalsy();
  });
});
