import { TestBed } from '@angular/core/testing';
import { RegistrationFormComponent } from './registration-form.component';

describe('RegistrationFormComponent (orchestration)', () => {
  let component: RegistrationFormComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationFormComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(RegistrationFormComponent);
    component = fixture.componentInstance;
  });

  it('initializes form with expected structure', () => {
    const form = component.form();

    expect(form.contains('personalInfo')).toBe(true);
    expect(form.contains('accountDetails')).toBe(true);
    expect(form.contains('preferences')).toBe(true);
  });

  it('creates correct number of steps', () => {
    expect(component.steps().length).toBe(3);
  });

  it('maps steps to subforms correctly', () => {
    const steps = component.steps();

    expect(steps[0].label).toBe('Personal Information');
    expect(steps[1].label).toBe('Account Details');
    expect(steps[2].label).toBe('Preferences & Consent');
  });

  it('returns correct subform for step', () => {
    const form = component.getFormForStep(0);

    expect(form).toBe(component.steps()[0].form);
  });

  it('does not submit invalid form', () => {
    const markSpy = vi.spyOn(component.form(), 'markAllAsTouched');

    component.submit();

    expect(markSpy).toHaveBeenCalled();
  });

  it('transitions to submitting state on valid submit', async () => {
    component.form().patchValue({
      personalInfo: {
        firstName: 'John',
        email: 'john@test.com',
      },
      preferences: {
        agreeToTerms: true,
        referralSource: 'test',
      },
    });

    component.submit();

    expect(component.status()).toBe('submitting');
  });
});
