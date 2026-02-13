import { NypIadPolicyService, NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'app/app.constants';
import { take } from 'rxjs/operators';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';

@Component({
    selector: 'app-policy-detail-recap-basic-ehealth',
    templateUrl: './policy-detail-recap-basic-ehealth.component.html',
    styleUrls: ['./policy-detail-recap-basic-ehealth.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicEhealthComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  constructor(
    private nypInsurancesService: NypInsurancesService,
    private nypIadPolicyService: NypIadPolicyService,
  ) {
    super();
  }

  policyPriceFromQuotation;

  ngOnInit() {
    if (this.policy.product.product_code === 'ehealth-quixa-standard') {
      this.getQuotationPrice();
    }
  }

  getQuotationPrice(): void {
    const quotationRequest = this.createQuotationPayload();
    this.nypInsurancesService.submitEhealthStandardQuotation(quotationRequest).pipe(take(1)).subscribe(quote =>
      this.policyPriceFromQuotation = quote.additional_data.data.InsuranceFees.pop().Price
    );
  }

  createQuotationPayload(): any {
    return {
      tenant: 'tim',
      product_code: this.policy.product.product_code,
      product_data: {}
    };
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
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
