import { CheckoutStepService } from '../services/checkout-step.service';
import { RequestOrder } from '@model';
import { CheckoutStep, CheckoutStepOperation } from './checkout-step.model';
import { ComponentFactory, OnDestroy, ViewChild, ViewContainerRef, Directive } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CheckoutLinearStepperBaseComponent } from '../checkout-linear-stepper/components/checkout-linear-stepper-base/checkout-linear-stepper-base.component';
import { CheckoutComponentFactory } from '../checkout-linear-stepper/services/component/checkout-component-factory.model';
import { CheckoutLinearStepperGenericState } from '../checkout-linear-stepper/services/state/checkout-linear-stepper-generic-state.model';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';

@Directive()
export abstract class CheckoutStepComponent implements OnDestroy {

  protected collaborationSectionComponent: CheckoutLinearStepperBaseComponent;
  showCollaborationSection: boolean = true;
  @ViewChild('collaboration', { read: ViewContainerRef, static: true }) collaborationSectionContainer: ViewContainerRef;

  @ViewChild('checkout_resume', { static: true }) stickyBar: any;

  constructor(
    protected checkoutStepService: CheckoutStepService,
    protected componentFeaturesService: ComponentFeaturesService
  ) { }

  get currentStep(): CheckoutStep {
    return this.checkoutStepService.step;
  }

  handleNextStep() {
    this.beforeHandleNextStep().subscribe(() => {
      this.checkoutStepService.completeStep(this.createCheckoutStepOperation());
    }, (error) => {
      console.log(error);
      throw error;
    });
  }

  handlePrevStep() {
    this.checkoutStepService.backStep((this.createCheckoutStepOperation()));
  }

  abstract createRequestOrder(): RequestOrder;

  ngOnDestroy(): void {
  }

  protected beforeHandleNextStep(): Observable<any> {
    return of({});
  }

  protected createCheckoutStepOperation(yinStep: CheckoutStep = undefined): CheckoutStepOperation {
    const ro = this.createRequestOrder() || {};
    ro.state = this.currentStep.name.replace('-', '_');
    return { step: yinStep ?? this.currentStep, data: ro, confirm: this.isConfirm() };
  }

  protected isConfirm() {
    return false;
  }

  protected createComponentsFromComponentFactories(componentFactories: CheckoutComponentFactory[], productCode: string) {
    this.showCollaborationSection = this.hasCollaborationSectionFactory(productCode);
    if (this.showCollaborationSection) {
      componentFactories.forEach(componentFactory => {
        switch (componentFactory.containerName) {
          case 'collaboration_section':
            this.collaborationSectionComponent = this.createComponentInView(this.collaborationSectionContainer, componentFactory.componentFactory);
            return;
          default:
            return;
        }
      });
    }
  }

  private hasCollaborationSectionFactory(productCode: string): boolean {
    this.componentFeaturesService.useComponent('checkout');
    this.componentFeaturesService.useRule('step-factory');
    if (this.componentFeaturesService.isRuleEnabled()) {
      const constraints = this.componentFeaturesService.getConstraints().get('products');
      return constraints.includes(productCode);
    }
    return false;
  }

  protected createComponentInView(view: ViewContainerRef
    , factory: ComponentFactory<CheckoutLinearStepperBaseComponent>): CheckoutLinearStepperBaseComponent {
    const componentRef = view.createComponent(factory);
    return componentRef.instance;
  }

  protected updateComponentProperties(state: CheckoutLinearStepperGenericState) {
    if (this.collaborationSectionComponent) {
      this.collaborationSectionComponent.data = state.collaboration_section;
    }
  }
}
