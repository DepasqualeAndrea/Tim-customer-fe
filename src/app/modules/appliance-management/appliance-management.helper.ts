import {ResponseOrder} from '@model';
import {ApplianceProperties, DomesticAppliance, DomesticApplianceKind} from './appliance-management.model';
import * as moment from 'moment';

export class ApplianceManagementHelper {

  static fromApplianceAttributesToDomesticAppliances(responseOrder: ResponseOrder, applianceProperties: ApplianceProperties): DomesticAppliance[] {
    const applianceAttributes: any[] = responseOrder.line_items[0].insured_entities.appliances || [];
    return ApplianceManagementHelper.fromBusinessAppliancesToDomesticAppliances(applianceAttributes, applianceProperties);
  }

  static fromBusinessAppliancesToDomesticAppliances(businessAppliances: any[], applianceProperties: ApplianceProperties): DomesticAppliance[] {
    return businessAppliances.map(item => {
      return {
        id: item.id,
        kind: {key: item.kind, value: applianceProperties.kinds[item.kind]},
        brand: {key: item.brand, value: item.brand},
        model: item.model,
        purchaseDate: moment(item.purchase_date).toDate(),
        category: ApplianceManagementHelper.computeCategory(item.kind, applianceProperties.categories),
        receiptNumber: item.receipt_number
      };
    });
  }

  static fromDomesticAppliancesToApplianceAttributes(appliances: DomesticAppliance[]): any[] {
    return appliances.map(appliance => ({
      id: appliance.id,
      kind: appliance.kind.key,
      brand: appliance.brand.key,
      model: appliance.model,
      receipt_number: appliance.receiptNumber,
      purchase_date_displayer: moment(appliance.purchaseDate).format('MM/YYYY'),
      purchase_date: moment(appliance.purchaseDate).startOf('month').format('DD/MM/YYYY'),
      _destroy: appliance._destroy
    }));
  }

  static computeCategory(kindKey: string, categories: { [key: string]: { kinds: Array<string> } }): string {
    return Object.keys(categories).find(cat => categories[cat].kinds.includes(kindKey));
  }

  static computeKinds(applianceProperties: ApplianceProperties, appliances: DomesticAppliance[]): Array<DomesticApplianceKind> {
    const allKinds = applianceProperties.kinds;
    const kinds = Object.keys(allKinds).map(k => ({
      key: k, value: allKinds[k],
      category: ApplianceManagementHelper.computeCategory(k, applianceProperties.categories)
    }));
    return ApplianceManagementHelper.filterKindsByConstraints(applianceProperties, appliances, kinds);
  }

  static filterKindsByConstraints(applianceProperties: ApplianceProperties, appliances: DomesticAppliance[], kinds: Array<DomesticApplianceKind>):
    Array<DomesticApplianceKind> {
    const constraintCats = applianceProperties.constraints.categories;
    const constraintKinds = applianceProperties.constraints.kinds;
    // Filter by category
    if (constraintCats) {
      return kinds.filter(kind => {
        const filteredAppliances: DomesticAppliance[] = appliances.filter(appliance => appliance.category === kind.category);
        const maxOccurrencies = constraintCats[kind.category] || Number.MAX_SAFE_INTEGER;
        return maxOccurrencies > filteredAppliances.length;
      });
    } else {
      // Filter by kind
      return kinds.filter(kind => {
        const filteredAppliances: DomesticAppliance[] = appliances.filter(appliance => appliance.kind.key === kind.key);
        const maxOccurrencies = constraintKinds[kind.key] || Number.MAX_SAFE_INTEGER;
        return maxOccurrencies > filteredAppliances.length;
      });
    }
  }


}
