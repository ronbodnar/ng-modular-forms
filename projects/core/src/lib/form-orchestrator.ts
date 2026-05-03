import { FormGroup } from '@angular/forms';
import { Directive, inject, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormHandlerBase } from './base/form-handler-base';
import { FormMapperBase } from './base/form-mapper-base';
import { FormHydrator } from './form-hydrator';
import { FormSerializer } from './form-serializer';
import {
  FormHandlerRegistry,
  FormOrchestratorOptions,
  FormStatus,
  MapperRegistry,
} from './types';

@Directive()
export abstract class FormOrchestrator
  extends FormMapperBase
  implements OnDestroy
{
  private readonly _form = signal<FormGroup>(new FormGroup({}));
  private readonly _handlers = signal<FormHandlerRegistry>([]);
  private readonly _mapperRegistry = signal<MapperRegistry>({});
  private readonly _status = signal<FormStatus>('idle');
  private readonly _errorMessage = signal<string | null>(null);

  public readonly form = this._form.asReadonly();
  public readonly handlers = this._handlers.asReadonly();
  public readonly mapperRegistry = this._mapperRegistry.asReadonly();
  public readonly status = this._status.asReadonly();
  public readonly errorMessage = this._errorMessage.asReadonly();

  private _logicSubscription = new Subscription();

  constructor(
    protected readonly hydrator: FormHydrator,
    protected readonly serializer: FormSerializer,
  ) {
    super();
  }

  /**
   * Initializes orchestration state.
   * Must be called before any subform registration or handler execution.
   */
  public orchestrate(options: FormOrchestratorOptions) {
    const { form, handlers, mapperRegistry } = options;
    this._form.set(form);
    this._handlers.set(handlers);
    this._mapperRegistry.set(mapperRegistry);

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

  public hydrateFromModel(model: any) {
    const form = this.form();
    const registry = this.mapperRegistry();

    Object.entries(form.controls).forEach(([key, control]) => {
      if (!(key in model)) return;

      const mapper = registry[key];
      const value = model?.[key];

      if (control instanceof FormGroup) {
        this.hydrator.hydrate(
          control,
          mapper ? mapper.fromModel(value) : value,
        );
      }
    });
  }

  public buildRequest(): any {
    return this.serializer.toRequest(this.form(), this.mapperRegistry());
  }

  ngOnDestroy(): void {
    this._logicSubscription.unsubscribe();
  }
}
