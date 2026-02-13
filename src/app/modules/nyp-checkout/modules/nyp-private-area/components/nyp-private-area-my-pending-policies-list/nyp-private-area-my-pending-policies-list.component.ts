import { Component } from '@angular/core';
import { AuthService } from '@services';
import { RecursivePartial } from 'app/modules/nyp-checkout/models/api.model';
import { TIM_BILL_PROTECTION_2_PRODUCT_NAME, TIM_BILL_PROTECTION_PRODUCT_NAME, TIM_BILL_PROTECTOR_PRODUCT_NAME, TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME, TIM_FOR_SKI_GOLD_PRODUCT_NAME, TIM_FOR_SKI_PLATINUM_PRODUCT_NAME, TIM_FOR_SKI_SILVER_PRODUCT_NAME, TIM_MY_PET_PRODUCT_NAME, TIM_PROTEZIONE_CASA_PRODUCT_NAME, TIM_SPORT_PRODUCT_NAME } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypApiService } from 'app/modules/nyp-checkout/services/api.service';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-nyp-private-area-my-pending-policies-list',
    templateUrl: './nyp-private-area-my-pending-policies-list.component.html',
    styleUrls: ['./nyp-private-area-my-pending-policies-list.component.scss'],
    standalone: false
})
export class NypPrivateAreaMyPendingPoliciesListComponent {
  private payment_frequency_type = {
    undefined: 'Una Tantum',
    'month': 'Mensile',
    'year': 'Annuale'
  };
  public policies$: Observable<IPendingPolicy[]> = this.nypApiService.getPendingPolicies().pipe(
    map(policies => policies.map(policy => {
      const product = this.nypDataService.Products$.value?.find(p => p.id == policy.orderItem.product_id);
      // Taking product's image (fp_image)
      const image = product?.images?.images?.find(im => im.image_type == 'fp_image')?.original_url;
      const productType = product?.description;
      const createdAt = policy.orderItem.created_at.split('T')[0].split('-');

      // Il bene viene recuperato in maniera verticale
      let bene = '';
      let paymentType = this.payment_frequency_type[(product as any).properties?.properties?.renewalFrequency?.durationType];
      switch (product.code) {
        case TIM_PROTEZIONE_CASA_PRODUCT_NAME: bene = `${policy.orderItem.insured_item.address} ${policy.orderItem.insured_item.house_number}, ${policy.orderItem.insured_item.city} (${policy.orderItem.insured_item.zipcode})`; break;
        case TIM_MY_PET_PRODUCT_NAME: bene = policy.orderItem.insured_item.name; break;
        case TIM_EHEALTH_QUIXA_STANDARD_PRODUCT_NAME: bene = `${this.authService.currentUser.firstname} ${this.authService.currentUser.lastname}`; break;
        case TIM_BILL_PROTECTION_PRODUCT_NAME:
        case TIM_BILL_PROTECTOR_PRODUCT_NAME: bene = `${this.authService.currentUser.firstname} ${this.authService.currentUser.lastname}`; break;
        case TIM_BILL_PROTECTION_2_PRODUCT_NAME: bene = `${this.authService.currentUser.firstname} ${this.authService.currentUser.lastname}`; break;
        case TIM_SPORT_PRODUCT_NAME: bene = `${this.authService.currentUser.firstname} ${this.authService.currentUser.lastname}`; break;
        case TIM_FOR_SKI_SILVER_PRODUCT_NAME:
        case TIM_FOR_SKI_GOLD_PRODUCT_NAME:
        case TIM_FOR_SKI_PLATINUM_PRODUCT_NAME: {
          const insureds = [];
          if (policy?.orderItem?.insured_item?.insured_is_contractor)
            insureds.push(`${this.authService.currentUser.firstname} ${this.authService.currentUser.lastname}`);

          if (!!policy?.orderItem?.insured_item?.insurance_holders_attributes) {
            Object.keys(policy.orderItem.insured_item.insurance_holders_attributes)
              .forEach(k => {
                insureds.push(`${policy.orderItem.insured_item.insurance_holders_attributes[k].first_name} ${policy.orderItem.insured_item.insurance_holders_attributes[k].last_name}`);
              })
          }

          bene = insureds.join(', ');
        }; break;
      }

      return {
        image: image,
        beneAssicurato: bene,
        price: policy.orderItem.price,
        policyNumber: policy.policyCode,
        paymentType: paymentType,
        createdAt: `${createdAt[2]}-${createdAt[1]}-${createdAt[0]}`,
        productType: productType,

      } as IPendingPolicy;
    }))
  );

  constructor(public nypApiService: NypApiService, public nypDataService: NypDataService, public authService: AuthService) { }
}

export interface IPendingPolicy {
  image: string;
  beneAssicurato: string;
  paymentType: 'Una Tantum' | 'Mensile' | 'Annuale';
  createdAt: string;
  price: string;
  policyNumber: string;
  productType: RecursivePartial<any> | string;
}
