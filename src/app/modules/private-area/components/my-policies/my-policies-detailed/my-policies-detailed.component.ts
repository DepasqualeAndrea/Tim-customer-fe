import { Component, OnInit } from '@angular/core';
import { InsurancesService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { Insurance } from '@model';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import { Policy } from 'app/modules/private-area/private-area.model';
import { CONSTANTS } from 'app/app.constants';
import { NypInsurancesService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-my-policies-detailed',
  templateUrl: './my-policies-detailed.component.html',
  styleUrls: ['./my-policies-detailed.component.scss']
})
export class MyPoliciesDetailedComponent implements OnInit {

  policies: Insurance[];
  nopolicies: boolean;

  active: string;
  verified: string;
  unverified: string;
  expired: string;
  canceled: string;
  suspended: string;


  constructor(
    protected nypInsurancesService: NypInsurancesService,
    private kenticoTranslateService: KenticoTranslateService,
  ) { }

  ngOnInit() {
    this.nypInsurancesService.getInsurances().subscribe(res => {
      this.policies = res.insurances.sort((a, b) => b.completed_at.localeCompare(a.completed_at));
      this.policies.forEach(policy => this.setDuration(policy));
      if (!this.policies || this.policies.length === 0) {
        this.nopolicies = true;
      }
    });

    this.kenticoTranslateService.getItem<any>('private_area.status_active').pipe(take(1)).subscribe(
      policyStatus => this.active = policyStatus.value
    );
    this.kenticoTranslateService.getItem<any>('private_area.status_verified').pipe(take(1)).subscribe(
      policyStatus => this.verified = policyStatus.value
    );
    this.kenticoTranslateService.getItem<any>('private_area.status_unverified').pipe(take(1)).subscribe(
      policyStatus => this.unverified = policyStatus.value
    );
    this.kenticoTranslateService.getItem<any>('private_area.status_expired').pipe(take(1)).subscribe(
      policyStatus => this.expired = policyStatus.value
    );
    this.kenticoTranslateService.getItem<any>('private_area.status_canceled').pipe(take(1)).subscribe(
      policyStatus => this.canceled = policyStatus.value
    );
    this.kenticoTranslateService.getItem<any>('private_area.status_suspended').pipe(take(1)).subscribe(
      policyStatus => this.suspended = policyStatus.value
    );
  }

  isPolicyPriceANumber(policy: any): boolean {
    return !!policy && !!policy.price && !isNaN(<number>policy.price);
  }

  getLabel(status) {
    switch (status) {
      case 'active':
        return this.active;
      case 'verified':
        return this.verified;
      case 'unverified':
        return this.unverified;
      case 'expired':
        return this.expired;
      case 'canceled':
        return this.canceled;
      case 'suspended':
        return this.suspended;
      default:
        break;
    }
  }

  getSmallImage(images) {
    if (images && images.length) {
      let imgs = _.find(images, ['image_type', 'fp_image']);
      if (!imgs) {
        imgs = _.find(images, ['image_type', 'default']) ? _.find(images, ['image_type', 'default']) : _.find(images, ['image_type', 'common_image']);
      }
      return imgs.small_url;
    } else {
      return '';
    }
  }

  setDuration(policy) {
    if (policy.product.payment_methods[0].type === 'Spree::Gateway::BraintreeRecurrent') {
      this.kenticoTranslateService.getItem<any>('private_area.monthly_duration_type').pipe().subscribe(item => {
        policy.duration = item.value;
      });
    } else {
      policy.duration = null;
    }
  }

  isCertificateMissing(policy: Policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

}
