import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputCurrencyComponent } from './mat-input-currency.component';
import { By } from '@angular/platform-browser';

describe('MatInputCurrencyComponent', () => {
  let fixture: ComponentFixture<MatInputCurrencyComponent>;
  let component: MatInputCurrencyComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatInputCurrencyComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatInputCurrencyComponent);
    component = fixture.componentInstance;
  });

  it('prevents default for non-digit keys', () => {
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    const event = new KeyboardEvent('keydown', { key: 'g', bubbles: true });
    vi.spyOn(event, 'preventDefault');

    input.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('parses and formats a valid number on input', () => {
    fixture.detectChanges();

    const onChangeMock = vi.fn();
    component.registerOnChange(onChangeMock);

    const input: HTMLInputElement = fixture.debugElement.query(
      By.css('input'),
    ).nativeElement;

    input.value = '1234';
    input.dispatchEvent(new Event('input'));

    expect(onChangeMock).toHaveBeenCalledWith(1234);
    expect(component.displayValue()).toBe('1,234');
  });
});
