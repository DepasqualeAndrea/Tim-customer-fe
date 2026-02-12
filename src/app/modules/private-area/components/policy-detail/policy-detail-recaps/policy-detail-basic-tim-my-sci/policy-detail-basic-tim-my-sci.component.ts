import { Component, OnInit } from '@angular/core';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';
import { CONSTANTS } from '../../../../../../app.constants';
import { NypIadPolicyService } from '@NYP/ngx-multitenant-core';

@Component({
  selector: 'app-policy-detail-basic-tim-my-sci',
  templateUrl: './policy-detail-basic-tim-my-sci.component.html',
  styleUrls: ['./policy-detail-basic-tim-my-sci.component.scss']
})
export class PolicyDetailBasicTimMySciComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  constructor(private nypIadPolicyService: NypIadPolicyService) {
    super();
  }

  ngOnInit() {
  }

  public isCertificateMissing(policy) {
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
