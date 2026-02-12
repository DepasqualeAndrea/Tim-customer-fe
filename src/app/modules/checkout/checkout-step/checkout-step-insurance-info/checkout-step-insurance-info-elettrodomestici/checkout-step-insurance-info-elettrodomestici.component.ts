import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {CheckoutStepInsuranceInfoDynamicComponent} from '../checkout-step-insurance-info-dynamic-component';
import {LineFirstItem, ResponseOrder} from '@model';
import {Observable} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {CheckoutStepInsuranceInfoProduct} from '../checkout-step-insurance-info.model';
import {DataService, InsurancesService} from '@services';
import {CheckoutStepInsuranceInfoElettrodomesticiProduct} from './checkout-step-insurance-info-elettrodomestici.model';
import {ApplianceProperties, DomesticAppliance, DomesticApplianceKind, mockAppliances} from '../../../../appliance-management/appliance-management.model';
import {ApplianceManagementHelper} from '../../../../appliance-management/appliance-management.helper';
import { GtmHandlerService } from 'app/core/services/gtm/gtm-handler.service';

@Component({
  selector: 'app-checkout-step-insurance-info-elettrodomestici',
  templateUrl: './checkout-step-insurance-info-elettrodomestici.component.html',
  styleUrls: ['./checkout-step-insurance-info-elettrodomestici.component.scss']
})
export class CheckoutStepInsuranceInfoElettrodomesticiComponent extends CheckoutStepInsuranceInfoDynamicComponent implements OnInit {

  form: FormGroup;

  appliances: DomesticAppliance[];

  applianceProperties: ApplianceProperties;

  kinds: Array<DomesticApplianceKind>;

  brands: Array<{ key: string, value: string }>;

  variantName: any;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private insurancesService: InsurancesService,
    ) {
    super();
  }

  ngOnInit() {
    const product: CheckoutStepInsuranceInfoElettrodomesticiProduct = <CheckoutStepInsuranceInfoElettrodomesticiProduct>Object.assign(this.product);
    this.applianceProperties = Object.assign({}, this.dataService.getResponseOrder().line_items[0].appliances_properties);
    this.appliances = Object.assign([], ApplianceManagementHelper.fromApplianceAttributesToDomesticAppliances(this.dataService.getResponseOrder(), this.applianceProperties));
    this.kinds = ApplianceManagementHelper.computeKinds(this.applianceProperties, this.appliances);
    this.insurancesService.getApplianceBrands().subscribe(res => this.brands = res.brands.map(brand => ({key: brand, value: brand})));
    this.form = this.formBuilder.group({
      registerAppliancesLater: new FormControl(product.registerAppliancesLater)
    });
    this.variantName = this.dataService.getResponseOrder().line_items[0].variant.name;
    }

  isFormValid(): boolean {
    const later = this.form.get('registerAppliancesLater').value;
    return !!later || (!later && this.appliances.length > 0);
  }

  onBeforeNextStep(): Observable<any> {
    return of(null);
  }

  computeProduct(): CheckoutStepInsuranceInfoProduct {
    return Object.assign({}, this.product, {insuredSubjects: null});
  }

  fillLineItem(lineItem: LineFirstItem): void {
    lineItem['appliances_attributes'] = this.computeApplianceAttributes(this.appliances, this.applianceProperties, this.dataService.getResponseOrder());
  }

  handleApplianceAdded(appliance: DomesticAppliance) {
    const category = ApplianceManagementHelper.computeCategory(appliance.kind.key, this.applianceProperties.categories);
    this.appliances = this.appliances.concat(Object.assign(appliance, {category}));
    this.kinds = ApplianceManagementHelper.computeKinds(this.applianceProperties, this.appliances);
  }

  handleApplianceRemoved(appliance: DomesticAppliance) {
    this.appliances = this.appliances.filter(a => a !== appliance);
    this.kinds = ApplianceManagementHelper.computeKinds(this.applianceProperties, this.appliances);
  }

  onRegisterApplianceLaterClicked(value) {
    this.appliances = value && [] || this.appliances;
  }

  computeApplianceAttributes(appliances: DomesticAppliance[], applianceProperties: ApplianceProperties, responseOrder: ResponseOrder): any[] {
    const newAppliances = Object.assign([], appliances);
    const prevAppliances: DomesticAppliance[] = ApplianceManagementHelper.fromApplianceAttributesToDomesticAppliances(responseOrder, applianceProperties);
    const missingAppliances = prevAppliances.filter(ps => !appliances.some(s => s.id === ps.id));
    newAppliances.push(...missingAppliances.map(ma => Object.assign({_destroy: true}, ma)));
    return ApplianceManagementHelper.fromDomesticAppliancesToApplianceAttributes(newAppliances);
  }

}
