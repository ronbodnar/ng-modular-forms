import { FormGroup } from '@angular/forms';
import { Directive, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormHandlerBase } from './form-handler-base';

export type FormStatus = 'idle' | 'submitting' | 'error' | 'success';

type FormHandlerRegistry = FormHandlerBase[];

@Directive()
export abstract class FormOrchestratorBase implements OnDestroy {
  private readonly _form = signal<FormGroup>(new FormGroup({}));
  private readonly _handlers = signal<FormHandlerRegistry>([]);
  private readonly _status = signal<FormStatus>('idle');
  private readonly _errorMessage = signal<string | null>(null);

  public readonly form = this._form.asReadonly();
  public readonly handlers = this._handlers.asReadonly();
  public readonly status = this._status.asReadonly();
  public readonly errorMessage = this._errorMessage.asReadonly();

  private _logicSubscription = new Subscription();

  /**
   * Initializes orchestration state.
   * Must be called before any subform registration or handler execution.
   */
  public initialize(form: FormGroup, handlers: FormHandlerRegistry = []) {
    this._form.set(form);
    this._handlers.set(handlers);

    Object.values(this.handlers()).forEach((handler) => {
      this.addReactiveLogic(handler.getReactiveLogic(form));
    });
  }

  public setForm(form: FormGroup) {
    this._form.set(form);
  }

  public getSubForm(key: string): FormGroup {
    return this.form().get(key) as FormGroup;
  }

  public addHandler(handler: FormHandlerBase) {
    this._handlers.set([...this._handlers(), handler]);
  }

  public addReactiveLogic(subscription: Subscription) {
    this._logicSubscription.add(subscription);
  }

  public setStatus(status: FormStatus) {
    this._status.set(status);
  }

  public setErrorMessage(message: string | null) {
    this._errorMessage.set(message);
  }

  ngOnDestroy(): void {
    this._logicSubscription.unsubscribe();
  }
}
