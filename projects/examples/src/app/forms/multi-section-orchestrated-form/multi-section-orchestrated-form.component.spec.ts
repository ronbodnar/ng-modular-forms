import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { MultiSectionOrchestratedFormComponent } from './multi-section-orchestrated-form.component';

describe('MultiSectionOrchestratedFormComponent', () => {
  let component: MultiSectionOrchestratedFormComponent;
  let fixture: ComponentFixture<MultiSectionOrchestratedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSectionOrchestratedFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSectionOrchestratedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with orchestrator', () => {
    expect(component.mainHandler()).toBeTruthy();
  });

  it('should handle subform ready events', () => {
    const testForm = new FormGroup({});
    component.onSubformReady(testForm, 'testSection');
    // The form should now contain the testSection
    expect(component.form().get('testSection')).toBe(testForm);
  });
});
