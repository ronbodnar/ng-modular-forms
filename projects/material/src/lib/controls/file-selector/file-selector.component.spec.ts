import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { MatInputFileSelectorComponent } from './file-selector.component';

describe('MatInputFileSelectorComponent', () => {
  let fixture: ComponentFixture<MatInputFileSelectorComponent>;
  let component: MatInputFileSelectorComponent;

  function getWrapper(): HTMLElement {
    return fixture.debugElement.query(By.css('mat-form-field')).nativeElement;
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatInputFileSelectorComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MatInputFileSelectorComponent);
    component = fixture.componentInstance;
  });

  it('renders accepted file types as comma separated string', () => {
    fixture.componentRef.setInput('accept', ['image/png', 'image/jpeg']);

    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input[type="file"]'))
      .nativeElement as HTMLInputElement;

    expect(input.accept).toBe('image/png,image/jpeg');
  });

  it('generates a single file name', () => {
    const file = new File(['content'], 'test.pdf');

    component.writeValue(file);

    expect(component.fileName()).toBe('test.pdf');
  });

  it('generates selected file count for multiple files', () => {
    const files = [new File(['a'], 'one.pdf'), new File(['b'], 'two.pdf')];

    component.writeValue(files);

    expect(component.fileName()).toBe('2 files selected');
  });

  it('emits a single file when multiple is false', () => {
    fixture.componentRef.setInput('multiple', false);

    const onChange = vi.fn();

    component.registerOnChange(onChange);

    fixture.detectChanges();

    const file = new File(['content'], 'test.txt');

    const fileInput = fixture.debugElement.query(By.css('input[type="file"]'))
      .nativeElement as HTMLInputElement;

    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });

    fileInput.dispatchEvent(new Event('change'));

    expect(onChange).toHaveBeenCalledWith(file);
  });

  it('emits an array of files when multiple is true', () => {
    fixture.componentRef.setInput('multiple', true);

    const onChange = vi.fn();

    component.registerOnChange(onChange);

    fixture.detectChanges();

    const files = [new File(['a'], 'one.txt'), new File(['b'], 'two.txt')];

    const fileInput = fixture.debugElement.query(By.css('input[type="file"]'))
      .nativeElement as HTMLInputElement;

    Object.defineProperty(fileInput, 'files', {
      value: files,
    });

    fileInput.dispatchEvent(new Event('change'));

    expect(onChange).toHaveBeenCalledWith(files);
  });

  it('renders loading spinner when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-spinner'));

    expect(spinner).not.toBeNull();
  });

  it('does not render loading spinner by default', () => {
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-spinner'));

    expect(spinner).toBeNull();
  });

  it('opens file picker when suffix button is clicked', () => {
    fixture.detectChanges();

    const fileInput = fixture.debugElement.query(By.css('input[type="file"]'))
      .nativeElement as HTMLInputElement;

    const clickSpy = vi.spyOn(fileInput, 'click');

    const button = fixture.debugElement.query(
      By.css('button[mat-icon-button]'),
    );

    button.triggerEventHandler('click');

    expect(clickSpy).toHaveBeenCalled();
  });

  it('does not update from drop events when drag/drop is disabled', () => {
    fixture.componentRef.setInput('enableDragDrop', false);

    const onChange = vi.fn();

    component.registerOnChange(onChange);

    fixture.detectChanges();

    const file = new File(['content'], 'dropped.txt');

    getWrapper().dispatchEvent(createDropEvent([file]));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('updates value from drop events when drag/drop is enabled', () => {
    fixture.componentRef.setInput('enableDragDrop', true);

    const onChange = vi.fn();

    component.registerOnChange(onChange);

    fixture.detectChanges();

    const file = new File(['content'], 'dropped.txt');

    getWrapper().dispatchEvent(createDropEvent([file]));

    expect(onChange).toHaveBeenCalledWith(file);
  });

  it('adds visible drag-over feedback while dragging', () => {
    fixture.componentRef.setInput('enableDragDrop', true);
    fixture.detectChanges();

    const wrapper = getWrapper();

    wrapper.dispatchEvent(new Event('dragenter', { bubbles: true }));
    fixture.detectChanges();

    expect(wrapper.classList.contains('drag-over')).toBe(true);

    wrapper.dispatchEvent(new Event('dragleave', { bubbles: true }));
    fixture.detectChanges();

    expect(wrapper.classList.contains('drag-over')).toBe(false);
  });
});
