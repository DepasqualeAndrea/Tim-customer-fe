import { Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService } from '@services';
import { ComponentFeaturesService } from 'app/core/services/componentFeatures.service';
import { TIM_BILL_PROTECTION_2_PRODUCT_NAME, TIM_BILL_PROTECTION_PRODUCT_NAME, TIM_BILL_PROTECTOR_PRODUCT_NAME, TIM_PROTEZIONE_CASA_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { Policy } from '../../../private-area.model';
import { PolicyUpdateEvent } from '../policy-detail.model';
import { PolicyDetailRecapDynamicComponent } from './policy-detail-recap-dynamic.component';
import { PolicyDetailBasicRecapItems, PolicyDetailRecapItems } from './policy-detail-recaps.model';

@Component({
    selector: 'app-policy-detail-recaps',
    templateUrl: './policy-detail-recaps.component.html',
    styleUrls: ['./policy-detail-recaps.component.scss'],
    standalone: false
})
export class PolicyDetailRecapsComponent implements OnInit, OnChanges {

  @ViewChild('dynamic', { read: ViewContainerRef, static: true }) viewContainerRef: ViewContainerRef;

  @Input() policy: Policy;

  @Output() policyUpdated: EventEmitter<PolicyUpdateEvent> = new EventEmitter<PolicyUpdateEvent>();

  private componentRef: ComponentRef<PolicyDetailRecapDynamicComponent>;

  policyDetailBasicEnabled: string[] = [];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private dataService: DataService,
    private componentFeaturesService: ComponentFeaturesService) {
  }

  ngOnInit() {
    this.componentFeaturesService.useComponent('policy-detail');
    this.componentFeaturesService.useRule('policy-detail-basic-enabled');
    this.policyDetailBasicEnabled = [...this.componentFeaturesService.getConstraints().get('products'), TIM_PROTEZIONE_CASA_PRODUCT_NAME, TIM_BILL_PROTECTION_PRODUCT_NAME, TIM_BILL_PROTECTION_2_PRODUCT_NAME, TIM_BILL_PROTECTOR_PRODUCT_NAME] || [];
    this.initComponent(this.policy);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.policy && !changes.policy.firstChange) {
      this.initComponent(this.policy);
    }
  }

  hasPolicyDetailBasic(policyDetailBasicEnabled: string[]) {
    return this.policyDetailBasicEnabled.findIndex(code => code === this.policy.product.product_code) >= 0;
  }

  initComponent(policy: Policy) {
    // TODO: remove 'if' when yolo products migrate to basic-layout for policy-detail
    const dynamicComponent = this.hasPolicyDetailBasic(this.policyDetailBasicEnabled)
      ? PolicyDetailBasicRecapItems[policy.product.product_code] || PolicyDetailBasicRecapItems['default']
      : PolicyDetailRecapItems[policy.product.product_code] || PolicyDetailRecapItems['default'];
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(dynamicComponent);
    this.viewContainerRef.clear();
    this.componentRef = this.viewContainerRef.createComponent<PolicyDetailRecapDynamicComponent>(componentFactory);
    this.componentRef.instance.policy = policy;
    this.componentRef.instance.policyUpdated = this.policyUpdated;
  }

}
