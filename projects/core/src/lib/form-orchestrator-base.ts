import { FormGroup } from '@angular/forms';
import { Directive, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormHandlerBase } from './form-handler-base';

export type FormStatus = 'idle' | 'submitting' | 'error' | 'success';

type FormHandlerRegistry = Record<string, FormHandlerBase<string>>;

interface FormOrchestratorOptions {
  mainHandler?: FormHandlerBase<string> | null;
  subHandlers?: FormHandlerRegistry;
}

@Directive()
export abstract class FormOrchestratorBase implements OnDestroy {
  private _form = signal<FormGroup>(new FormGroup({}));

  private _mainHandler = signal<FormHandlerBase<string> | null>(null);
  private _subHandlers = signal<FormHandlerRegistry>({});

  private _status = signal<FormStatus>('idle');
  private _errorMessage = signal<string | null>(null);

  private _loadedHandlers = signal<number>(0);
  private _allHandlersLoaded = signal<boolean>(false);

  private _logicSubscription = new Subscription();

  public readonly form = this._form.asReadonly();
  public readonly mainHandler = this._mainHandler.asReadonly();
  public readonly subHandlers = this._subHandlers.asReadonly();
  public readonly status = this._status.asReadonly();
  public readonly errorMessage = this._errorMessage.asReadonly();

  /**
   * Initializes orchestration state.
   * Must be called before any subform registration or handler execution.
   */
  public initialize(
    form: FormGroup,
    formOrchestratorOptions?: FormOrchestratorOptions,
  ) {
    const { mainHandler, subHandlers = {} } = formOrchestratorOptions ?? {};

    this._form.set(form);
    this._mainHandler.set(mainHandler ?? null);
    this._subHandlers.set(subHandlers);
    this._loadedHandlers.set(0);

    const subHandlerCount = Object.keys(this.subHandlers());
    if (subHandlerCount.length === 0) {
      this.loadMainHandler();
    }
  }

  public setForm(form: FormGroup) {
    this._form.set(form);
  }

  public getHandler(key: string): FormHandlerBase<string> | undefined {
    return this.subHandlers()[key];
  }

  public setHandler(key: string, handler: FormHandlerBase<string>) {
    this._subHandlers.set({
      ...this._subHandlers(),
      [key]: handler,
    });
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

  /**
   * Registers a subform into the main form tree and coordinates handler execution.
   *
   * IMPORTANT:
   * - Handler execution is gated until all registered subhandlers are ready.
   * - Calling order matters; this is lifecycle-sensitive orchestration logic.
   */
  onSubformReady(
    subform: FormGroup,
    groupName: string,
    nestGroups: boolean = false,
  ): void {
    if (nestGroups) {
      this.form().setControl(groupName, subform);
    } else {
      const keys = Object.keys(subform.controls);
      keys.forEach((key) => {
        this.form().setControl(key, subform.get(key));
      });
    }

    // Prevent duplicate main handler execution when all subhandlers already resolved
    if (this._allHandlersLoaded()) {
      return;
    }

    const subformHandler = this.subHandlers()[groupName];

    if (subformHandler) {
      this._loadedHandlers.set(this._loadedHandlers() + 1);
      this.addReactiveLogic(subformHandler.getReactiveLogic());
    }

    const totalSubHandlers = Object.keys(this.subHandlers()).length;
    const allSubHandlersLoaded = this._loadedHandlers() === totalSubHandlers;

    if (allSubHandlersLoaded && this.mainHandler()) {
      this.loadMainHandler();
    }
  }

  private loadMainHandler() {
    if (!this.mainHandler()) return;

    this.addReactiveLogic(this.mainHandler()!.getReactiveLogic(this.form()));
    this._allHandlersLoaded.set(true);
  }
}
