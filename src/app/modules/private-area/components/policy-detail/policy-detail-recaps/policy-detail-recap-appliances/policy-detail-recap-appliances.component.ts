import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PolicyDetailRecapDynamicComponent} from '../policy-detail-recap-dynamic.component';
import {ApplianceManagementHelper} from '../../../../../appliance-management/appliance-management.helper';
import {DomesticAppliance, DomesticApplianceKind} from '../../../../../appliance-management/appliance-management.model';
import {PolicyUpdateItem} from '../../policy-detail.model';
import {InsurancesService} from '@services';

@Component({
  selector: 'app-policy-detail-recap-appliances',
  templateUrl: './policy-detail-recap-appliances.component.html',
  styleUrls: ['./policy-detail-recap-appliances.component.scss']
})
export class PolicyDetailRecapAppliancesComponent extends PolicyDetailRecapDynamicComponent implements OnInit, OnChanges {

  editCollapsed = true;

  appliances: DomesticAppliance[];

  originalAppliances: DomesticAppliance[];

  kinds: Array<DomesticApplianceKind>;

  brands: Array<{ key: string, value: string }>;

  constructor(private insurancesService: InsurancesService) {
    super();
  }

  ngOnInit() {
    this.insurancesService.getApplianceBrands().subscribe(res => this.brands = res.brands.map(brand => ({key: brand, value: brand})));
    this.initAppliances();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.policy && !changes.policy.firstChange) {
      this.initAppliances();
    }
  }

  initAppliances() {
    this.policy.appliance_properties = Object.assign({}, this.policy.appliance_properties);
    this.appliances = ApplianceManagementHelper.fromBusinessAppliancesToDomesticAppliances(this.policy.insuredEntities.appliances, this.policy.appliance_properties);
    this.originalAppliances = Object.assign([], this.appliances);
    this.kinds = ApplianceManagementHelper.computeKinds(this.policy.appliance_properties, this.appliances);
  }

  handleApplianceAdded(appliance: DomesticAppliance) {
    const category = ApplianceManagementHelper.computeCategory(appliance.kind.key, this.policy.appliance_properties.categories);
    this.appliances = this.appliances.concat(Object.assign(appliance, {category}));
    this.kinds = ApplianceManagementHelper.computeKinds(this.policy.appliance_properties, this.appliances);
  }

  handleApplianceRemoved(appliance: DomesticAppliance) {
    this.appliances = this.appliances.filter(a => a !== appliance);
    this.kinds = ApplianceManagementHelper.computeKinds(this.policy.appliance_properties, this.appliances);
  }


  saveAppliances() {
    this.policyUpdated.emit({
      item: PolicyUpdateItem.APPLIANCES,
      value: this.computeAppliances()
    });
  }

  computeAppliances() {
    const missingAppliances = this.originalAppliances.filter(item => !this.appliances.some(a => a.id === item.id));
    const newAppliances = Object.assign([], this.appliances);
    newAppliances.push(...missingAppliances.map(ma => Object.assign({_destroy: true}, ma)));
    return ApplianceManagementHelper.fromDomesticAppliancesToApplianceAttributes(newAppliances);
  }
}
