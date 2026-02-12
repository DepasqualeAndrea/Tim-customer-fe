import { Component, OnDestroy, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { Observable } from 'rxjs';
import { CheckoutStepInsuranceInfoChubbSportComponent } from '../checkout-step-insurance-info-chubb-sport/checkout-step-insurance-info-chubb-sport.component';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import { CheckoutStepInsuranceInfoSportComponent } from '../checkout-step-insurance-info-sport/checkout-step-insurance-info-sport.component';
import { CheckoutStepInsuranceInfoProduct } from '../checkout-step-insurance-info.model';

type FactoryConstraintConfig = {
  products: string[],
  factory: string
}

@Component({
  selector: 'app-checkout-step-insurance-info-handler',
  templateUrl: './checkout-step-insurance-info-handler.component.html',
  styleUrls: ['./checkout-step-insurance-info-handler.component.scss']
})
export class CheckoutStepInsuranceInfoHandlerComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit, OnDestroy {

  @ViewChild('insurance_info_step', { read: ViewContainerRef, static: true })
  insuranceInfoStepContainer: ViewContainerRef;

  private insuranceInfoStepComponent: CheckoutStepInsuranceInfoDynamicComponent;

  private readonly COMPONENT = 'checkout-step-insurance-info';
  private readonly RULE = 'get-factory';
  private readonly CONSTRAINT = 'configs';

  constructor(
    private componentFeaturesService: ComponentFeaturesService
  ) {super();}

  ngOnInit() {
    this.insuranceInfoStepContainer.clear();
    this.insuranceInfoStepComponent = this.createComponentInView(this.insuranceInfoStepContainer);
    this.insuranceInfoStepComponent.product = this.product;
  }


  private createComponentInView(view: ViewContainerRef): CheckoutStepInsuranceInfoDynamicComponent {
    const componentRef = view.createComponent(this.getComponent());
    return componentRef.instance;
  }

  private getComponent(): Type<CheckoutStepInsuranceInfoDynamicComponent> {
    const componentFactoryType = this.getComponentFactoryTypeFromRule();
    switch (componentFactoryType) {
      case 'YoloSport2.0': return CheckoutStepInsuranceInfoSportComponent;
      default: return CheckoutStepInsuranceInfoChubbSportComponent;
    }
  }

  private getComponentFactoryTypeFromRule(): string {
    this.componentFeaturesService.useComponent(this.COMPONENT);
    this.componentFeaturesService.useRule(this.RULE);
    if (this.componentFeaturesService.isRuleEnabled()) {
      const configs: FactoryConstraintConfig[] = this.componentFeaturesService.getConstraints().get(this.CONSTRAINT);
      return configs.find(config => config.products.includes(this.product.code)).factory;
    }
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    return this.insuranceInfoStepComponent.computeProduct();
  }

  onBeforeNextStep(): Observable<any> {
    return this.insuranceInfoStepComponent.onBeforeNextStep();
  }

  isFormValid(): boolean {
    return this.insuranceInfoStepComponent.isFormValid();
  }

  ngOnDestroy(): void {
    this.insuranceInfoStepComponent = null;
  }

}
