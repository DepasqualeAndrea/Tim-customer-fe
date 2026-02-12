import { LegalProtectionAddon } from './legal-protection-addon.model';

export class PolicyFromUrl {
  variant_id: number;
  product_code: string;
  selected_addons: LegalProtectionAddon[];

  constructor(variantId: string, addonIds: string, productCode: string, addons: LegalProtectionAddon[] ) {
    this.variant_id = +variantId;
    const ids = [];
    addonIds.split(',').forEach(id => {
      if(id.length > 0 ) {
        ids.push(+id);
      }
    });
    this.selected_addons = ids.map((id) => {
      const selectedAddOn = addons.find(( addOnItem) => addOnItem.id === id);
      return selectedAddOn;
    });
    this.product_code = productCode;
  }
}
