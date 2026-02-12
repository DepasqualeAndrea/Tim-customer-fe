import { Component, OnInit } from '@angular/core';
import { InsurancesService } from '@services';
import { CONSTANTS } from 'app/app.constants';
import { take } from 'rxjs/operators';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';
import { NypIadPolicyService, NypInsurancesService } from '@NYP/ngx-multitenant-core';


@Component({
  selector: 'app-policy-detail-basic-tim-my-home',
  templateUrl: './policy-detail-basic-tim-my-home.component.html',
  styleUrls: ['./policy-detail-basic-tim-my-home.component.scss']
})
export class PolicyDetailBasicTimMyHomeComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  constructor(
    private nypInsurancesService: NypInsurancesService,
    private nypIadPolicyService: NypIadPolicyService,
  ) {
    super();
  }

  public policyPriceFromQuotation: string;

  ngOnInit() {
    if (this.policy.product.product_code === 'ehealth-quixa-standard') {
      this.getQuotationPrice();
    }
  }

  private getQuotationPrice(): void {
    const quotationRequest = this.createQuotationPayload();
    this.nypInsurancesService.submitEhealthStandardQuotation(quotationRequest).pipe(take(1)).subscribe(quote =>
      this.policyPriceFromQuotation = quote.additional_data.data.InsuranceFees.pop().Price
    );
  }

  private createQuotationPayload(): any {
    return {
      tenant: 'tim',
      product_code: this.policy.product.product_code,
      product_data: {}
    };
  }

  public isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  public getPolicyNumber(policy: any): string {
    if (!!policy.masterPolicyNumber && !!policy.policyNumber) {
      return policy.policyNumber + ' / ' + policy.masterPolicyNumber
    }
    if (!policy.masterPolicyNumber && !!policy.policyNumber) {
      return policy.policyNumber
    }
    if (!!policy.masterPolicyNumber && !policy.policyNumber) {
      return policy.masterPolicyNumber
    }
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
