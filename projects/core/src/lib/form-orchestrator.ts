import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Directive, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormHandlerBase } from './base/form-handler-base';
import { FormMapperBase } from './base/form-mapper-base';
import { FormHydrator } from './form-hydrator';
import { FormSerializer } from './form-serializer';
import type {
  FormHandlerRegistry,
  FormOrchestratorOptions,
  FormStatus,
  MapperRegistry,
} from './types';
import { isRecord } from './type-guards';

@Directive()
export abstract class FormOrchestrator
  extends FormMapperBase
  implements OnDestroy
{
  private readonly _form = signal<FormGroup>(new FormGroup({}));
  private readonly _handlerRegistry = signal<FormHandlerRegistry>([]);
  private readonly _mapperRegistry = signal<MapperRegistry>({});
  private readonly _status = signal<FormStatus>('idle');
  private readonly _errorMessage = signal<string | null>(null);

  public readonly form = this._form.asReadonly();
  public readonly handlerRegistry = this._handlerRegistry.asReadonly();
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
    const { form, mapperRegistry = {}, handlerRegistry = [] } = options;
    this._form.set(form);
    this._mapperRegistry.set(mapperRegistry);
    this._handlerRegistry.set(handlerRegistry);

    Object.values(this.handlerRegistry()).forEach((handler) => {
      this.addReactiveLogic(handler.getReactiveLogic(form));
    });
  }

  public setForm(form: FormGroup) {
    this._form.set(form);
  }

  public getSubForm<T extends AbstractControl = AbstractControl>(
    key: string,
  ): T {
    return this.form().get(key) as T;
  }

  public addHandlerToRegistry<TControls extends Record<string, FormControl>>(
    handler: FormHandlerBase<TControls>,
  ) {
    this._handlerRegistry.set([...this._handlerRegistry(), handler]);
    this.addReactiveLogic(handler.getReactiveLogic(this.form()));
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

  public hydrateFromModel<TModel extends object>(model: TModel) {
    const form = this.form();
    const registry = this.mapperRegistry();

    Object.entries(form.controls).forEach(([key, control]) => {
      if (!(key in model)) return;

      const mapper = registry[key];
      const value = (model as Record<string, unknown>)[key];

      if (control instanceof FormControl) {
        const mapped = mapper ? mapper.fromModel(value) : value;
        control.setValue(mapped, { emitEvent: false });
        return;
      }

      if (control instanceof FormGroup) {
        const mapped = mapper ? mapper.fromModel(value) : value;
        if (isRecord(mapped)) {
          this.hydrator.hydrate(control, mapped, registry);
        }
      }
    });
  }

  public buildRequest<TOptions extends object>(
    options?: TOptions,
  ): Record<string, unknown> {
    return this.serializer.toRequest<TOptions>(
      this.form(),
      this.mapperRegistry(),
      options,
    );
  }

  ngOnDestroy(): void {
    this._logicSubscription.unsubscribe();
  }
}
