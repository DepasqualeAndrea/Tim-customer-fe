import { NypIadPolicyService } from '@NYP/ngx-multitenant-core';
import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'app/app.constants';
import { TimMyPetApiService } from 'app/modules/nyp-checkout/modules/tim-my-pet/services/api.service';
import { TIM_CYBER_CONSUMER_KENTICO_NAME, TIM_CYBER_CONSUMER_KENTICO_SLUG } from 'app/modules/nyp-checkout/nyp-checkout.module';
import { NypDataService } from 'app/modules/nyp-checkout/services/nyp-data.service';
import { PolicyDetailRecapDynamicComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-recaps/policy-detail-recap-dynamic.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
    selector: 'app-policy-detail-basic-tim-cyber-consumer',
    templateUrl: './policy-detail-basic-tim-cyber-consumer.component.html',
    styleUrls: ['./policy-detail-basic-tim-cyber-consumer.component.scss'],
    standalone: false
})
export class PolicyDetailBasicTimCyberConsumerComponent extends PolicyDetailRecapDynamicComponent implements OnInit {
  public Warranties$: Observable<string[]>;

  constructor(
    private apiService: TimMyPetApiService,
    private nypIadPolicyService: NypIadPolicyService,
    private nypDataService: NypDataService,
  ) {
    super();
  }

  public isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  public ngOnInit(): void {
    this.Warranties$ = this.nypDataService
      .downloadKenticoContent(TIM_CYBER_CONSUMER_KENTICO_NAME, TIM_CYBER_CONSUMER_KENTICO_SLUG)
      .pipe(
        mergeMap(() => this.apiService.getOrderById(this.policy?.order_id)),
        map(order => order?.orderItem[0]?.instance?.chosenWarranties?.data?.warranties?.map(w => `${w.translationCode}`)),
      );
  }

  public getPolicyNumber(policy: any): string {
    return policy?.orderCode;
  }

  downloadFile(policy) {
    this.nypIadPolicyService.getDocument(policy.policyNumber).subscribe(res => {
      const source = `data:application/pdf;base64,${res.file}`;
      const link = document.createElement("a");

      link.href = source;
      link.download = res.fileName;

      link.click();
    });
  }

}