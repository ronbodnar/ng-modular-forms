import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { InputFileSelectorComponent } from './file-selector.component';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InputFileSelectorComponent],
  template: `
    <form [formGroup]="form">
      <nmf-file-selector
        formControlName="file"
        label="File"
        [accept]="accept"
        [multiple]="multiple"
      />
    </form>
  `,
})
class HostComponent {
  accept: string | string[] | null = null;
  multiple = false;

  form = new FormGroup({
    file: new FormControl<File | File[] | null>(null, Validators.required),
  });
}

describe('InputFileSelectorComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function createFile(
    name: string,
    type = 'text/plain',
    contents = 'test',
  ): File {
    return new File([contents], name, { type });
  }

  function setFiles(input: HTMLInputElement, files: File[]) {
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: files,
    });

    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('shows required error when touched and invalid', () => {
    const control = host.form.controls.file;

    control.markAsTouched();
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.nmf-hint-label.error');

    expect(error?.textContent.trim()).toBe('This field is required');
  });

  it('updates the form control with a single File', () => {
    const input = fixture.debugElement.query(By.css('input'))
      .nativeElement as HTMLInputElement;

    const file = createFile('resume.pdf', 'application/pdf');

    setFiles(input, [file]);

    expect(host.form.controls.file.value).toBe(file);
  });

  it('updates the form control with multiple files', () => {
    host.multiple = true;
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'))
      .nativeElement as HTMLInputElement;

    const file1 = createFile('one.txt');
    const file2 = createFile('two.txt');

    setFiles(input, [file1, file2]);

    expect(host.form.controls.file.value).toEqual([file1, file2]);
  });

  it('sets the accept attribute from a string', () => {
    host.accept = '.jpg,.png';
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'))
      .nativeElement as HTMLInputElement;

    expect(input.getAttribute('accept')).toBe('.jpg,.png');
  });

  it('joins an array accept value into a comma-separated string', () => {
    host.accept = ['.jpg', '.png', '.gif'];
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'))
      .nativeElement as HTMLInputElement;

    expect(input.getAttribute('accept')).toBe('.jpg,.png,.gif');
  });

  it('sets the multiple attribute', () => {
    host.multiple = true;
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'))
      .nativeElement as HTMLInputElement;

    expect(input.multiple).toBe(true);
  });

  it('writes a File value through the ControlValueAccessor', () => {
    const file = createFile('avatar.png', 'image/png');

    host.form.controls.file.setValue(file);
    fixture.detectChanges();

    const component = fixture.debugElement.query(
      By.directive(InputFileSelectorComponent),
    ).componentInstance as InputFileSelectorComponent;

    expect(component.value()).toBe(file);
  });
});
