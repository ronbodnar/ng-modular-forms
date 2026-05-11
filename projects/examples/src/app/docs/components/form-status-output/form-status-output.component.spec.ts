import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormStatusOutputComponent } from './form-status-output.component';
import { provideHttpClient } from '@angular/common/http';

describe('FormStatusOutputComponent', () => {
  let fixture: ComponentFixture<FormStatusOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormStatusOutputComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(FormStatusOutputComponent);
    fixture.detectChanges();
  });

  it('renders provided values', () => {
    fixture.componentRef.setInput('status', 'success');
    fixture.componentRef.setInput('errorMessage', 'Boom');
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent;

    expect(content).toContain('success');
    expect(content).toContain('Boom');
  });
});
