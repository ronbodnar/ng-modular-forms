import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormSubmitButtonComponent } from './form-submit-button.component';

describe('FormSubmitButtonComponent', () => {
  let fixture: ComponentFixture<FormSubmitButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSubmitButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormSubmitButtonComponent);
    fixture.detectChanges();
  });

  it('reflects loading state', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });
});
