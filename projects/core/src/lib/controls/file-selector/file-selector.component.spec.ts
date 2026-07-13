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
        [selectionMode]="selectionMode"
        [enableDragDrop]="enableDragDrop"
      />
    </form>
  `,
})
class HostComponent {
  accept: string | string[] | null = null;
  multiple = false;
  selectionMode: 'replace' | 'append' = 'replace';
  enableDragDrop = false;

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

  function getFileInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input[type="file"]'))
      .nativeElement;
  }

  function getDisplayInput(): HTMLInputElement {
    return fixture.debugElement.query(By.css('input[type="text"]'))
      .nativeElement;
  }

  function getComponent(): InputFileSelectorComponent {
    return fixture.debugElement.query(By.directive(InputFileSelectorComponent))
      .componentInstance;
  }

  function getControlWrapper(): HTMLElement {
    return fixture.debugElement.query(By.css('.nmf-control-wrapper'))
      .nativeElement;
  }

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

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function createDropEvent(files: File[]): DragEvent {
    const event = new Event('drop', {
      bubbles: true,
      cancelable: true,
    }) as DragEvent;

    Object.defineProperty(event, 'dataTransfer', {
      configurable: true,
      value: {
        files,
      },
    });

    return event;
  }

  it('shows required error when touched and invalid', () => {
    host.form.controls.file.markAsTouched();
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.nmf-hint-label.error');

    expect(error?.textContent.trim()).toBe('This field is required');
  });

  it('updates the form control with a single File', () => {
    const file = createFile('resume.pdf', 'application/pdf');

    setFiles(getFileInput(), [file]);

    expect(host.form.controls.file.value).toBe(file);
  });

  it('updates the form control with multiple files', () => {
    host.multiple = true;
    fixture.detectChanges();

    const files = [createFile('one.txt'), createFile('two.txt')];

    setFiles(getFileInput(), files);

    expect(host.form.controls.file.value).toEqual(files);
  });

  it('sets the accept attribute from a string', () => {
    host.accept = '.jpg,.png';
    fixture.detectChanges();

    expect(getFileInput().getAttribute('accept')).toBe('.jpg,.png');
  });

  it('joins an array accept value into a comma-separated string', () => {
    host.accept = ['.jpg', '.png', '.gif'];
    fixture.detectChanges();

    expect(getFileInput().getAttribute('accept')).toBe('.jpg,.png,.gif');
  });

  it('sets the multiple attribute', () => {
    host.multiple = true;
    fixture.detectChanges();

    expect(getFileInput().multiple).toBe(true);
  });

  it('writes a File value through the ControlValueAccessor', () => {
    const file = createFile('avatar.png', 'image/png');

    host.form.controls.file.setValue(file);
    fixture.detectChanges();

    expect(getComponent().value()).toBe(file);
    expect(getDisplayInput().value).toBe('avatar.png');
  });

  it('writes multiple files through the ControlValueAccessor', () => {
    const files = [createFile('one.png'), createFile('two.png')];

    host.form.controls.file.setValue(files);
    fixture.detectChanges();

    expect(getComponent().value()).toEqual(files);
    expect(getDisplayInput().value).toContain('2');
  });

  it('uses append selection mode when selecting multiple files', () => {
    host.multiple = true;
    host.selectionMode = 'append';
    fixture.detectChanges();

    const first = createFile('one.txt');
    const second = createFile('two.txt');

    setFiles(getFileInput(), [first]);
    setFiles(getFileInput(), [second]);

    expect(host.form.controls.file.value).toEqual([first, second]);
  });

  it('uses replace selection mode when selecting multiple files', () => {
    host.multiple = true;
    host.selectionMode = 'replace';
    fixture.detectChanges();

    const first = createFile('one.txt');
    const second = createFile('two.txt');

    setFiles(getFileInput(), [first]);
    setFiles(getFileInput(), [second]);

    expect(host.form.controls.file.value).toEqual([second]);
  });

  it('clears the native file input after selection', () => {
    const input = getFileInput();

    setFiles(input, [createFile('test.txt')]);

    expect(input.value).toBe('');
  });

  it('does not update from drop events when drag/drop is disabled', () => {
    const file = createFile('dropped.txt');

    getControlWrapper().dispatchEvent(createDropEvent([file]));
    fixture.detectChanges();

    expect(host.form.controls.file.value).toBeNull();
  });

  it('updates the form control when files are dropped and drag/drop is enabled', () => {
    host.enableDragDrop = true;
    fixture.detectChanges();

    const file = createFile('dropped.txt');

    getControlWrapper().dispatchEvent(createDropEvent([file]));
    fixture.detectChanges();

    expect(host.form.controls.file.value).toBe(file);
  });

  it('sets drag-over class while dragging when drag/drop is enabled', () => {
    host.enableDragDrop = true;
    fixture.detectChanges();

    const wrapper = getControlWrapper();

    wrapper.dispatchEvent(new Event('dragenter', { bubbles: true }));
    fixture.detectChanges();
    expect(wrapper.classList.contains('drag-over')).toBe(true);
    expect(wrapper.style.boxShadow).toContain('var(--nmf-input-accent-color)');

    wrapper.dispatchEvent(new Event('dragleave', { bubbles: true }));
    fixture.detectChanges();
    expect(wrapper.classList.contains('drag-over')).toBe(false);
    expect(wrapper.style.boxShadow).toBe('');
  });
});
