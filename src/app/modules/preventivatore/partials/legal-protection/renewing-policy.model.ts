import { LegalProtectionAddon } from './legal-protection-addon.model';
import { PolicyFromUrl } from './policy-from-url.model';

export class RenewingPolicyFromUrl extends PolicyFromUrl {
  policy_id: number;
  variant_id: number;
  product_code: string;
  selected_addons: LegalProtectionAddon[];

  constructor(policyId: string, variantId: string, addonIds: string, productCode: string, addons: LegalProtectionAddon[] ) {
    super(variantId, addonIds, productCode, addons);
    this.policy_id = +policyId;
  }
}
