import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Directive, OnDestroy, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormMapperBase } from './base/form-mapper-base';
import { FormHydrator } from './form-hydrator';
import { FormSerializer } from './form-serializer';
import type {
  FormHandlerRegistry,
  FormMapperRegistry,
  FormOrchestratorOptions,
  FormStatus,
} from './types';
import { isRecord } from './type-guards';

@Directive()
export abstract class FormOrchestrator<
  TModel = unknown,
  TRequest = TModel,
  TForm = TModel,
  TOptions extends object = object,
  TMapperRegistry extends FormMapperRegistry = FormMapperRegistry,
  THandlerRegistry extends FormHandlerRegistry = FormHandlerRegistry,
>
  extends FormMapperBase<TModel, TRequest, TForm, TOptions>
  implements OnDestroy
{
  private readonly _form = signal<FormGroup>(new FormGroup({}));
  private readonly _status = signal<FormStatus>('idle');
  private readonly _errorMessage = signal<string | null>(null);
  private readonly _mapperRegistry = signal<TMapperRegistry>(
    {} as TMapperRegistry,
  );
  private readonly _handlerRegistry = signal<THandlerRegistry>(
    [] as unknown as THandlerRegistry,
  );

  public readonly form = this._form.asReadonly();
  public readonly status = this._status.asReadonly();
  public readonly errorMessage = this._errorMessage.asReadonly();
  public readonly mapperRegistry = this._mapperRegistry.asReadonly();
  public readonly handlerRegistry = this._handlerRegistry.asReadonly();

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
  public orchestrate(
    options: FormOrchestratorOptions<TMapperRegistry, THandlerRegistry>,
  ) {
    const { form, mapperRegistry, handlerRegistry } = options;
    this._form.set(form);
    this._mapperRegistry.set((mapperRegistry ?? {}) as TMapperRegistry);
    this._handlerRegistry.set((handlerRegistry ?? []) as THandlerRegistry);

    Object.values(this.handlerRegistry()).forEach((handler) => {
      this._logicSubscription.add(handler.getReactiveLogic(form));
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

  public addHandlerToRegistry(handler: THandlerRegistry[number]) {
    if (handler == null || this.handlerRegistry().includes(handler)) {
      return;
    }
    this._handlerRegistry.set([
      ...this._handlerRegistry(),
      handler,
    ] as THandlerRegistry);
    this._logicSubscription.add(handler.getReactiveLogic(this.form()));
  }

  public setStatus(status: FormStatus) {
    this._status.set(status);
  }

  public setErrorMessage(message: string | null) {
    this._errorMessage.set(message);
  }

  public hydrateFromModel(model: TModel, emitEvents: boolean = false) {
    if (!isRecord(model)) {
      return;
    }

    const form = this.form();
    const registry = this.mapperRegistry();

    Object.entries(form.controls).forEach(([key, control]) => {
      if (!(key in model)) return;

      const mapper = registry[key];
      const value = model[key];

      if (control instanceof FormControl) {
        const mapped = mapper ? mapper.fromModel(value) : value;
        control.setValue(mapped, { emitEvent: emitEvents });
        return;
      }

      if (control instanceof FormGroup) {
        const mapped = mapper ? mapper.fromModel(value) : value;
        if (isRecord(mapped)) {
          this.hydrator.hydrate(control, mapped, registry, emitEvents);
        }
      }
    });
  }

  public buildRequest(options?: TOptions): TRequest {
    return this.serializer.toRequest(
      this.form(),
      this.mapperRegistry(),
      options,
    ) as TRequest;
  }

  ngOnDestroy(): void {
    this._logicSubscription.unsubscribe();
  }

  // only for testing
  public get _testLogicSubscription() {
    return this._logicSubscription;
  }
}
