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
});
