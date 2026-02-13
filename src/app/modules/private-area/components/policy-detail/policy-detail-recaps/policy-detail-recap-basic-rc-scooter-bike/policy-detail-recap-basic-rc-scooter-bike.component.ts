import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '@services';
import { CONSTANTS } from 'app/app.constants';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import { PolicyDetailRecapDynamicComponent } from '../policy-detail-recap-dynamic.component';

@Component({
    selector: 'app-policy-detail-recap-basic-rc-scooter-bike',
    templateUrl: './policy-detail-recap-basic-rc-scooter-bike.component.html',
    styleUrls: ['./policy-detail-recap-basic-rc-scooter-bike.component.scss'],
    standalone: false
})
export class PolicyDetailRecapBasicRcScooterBikeComponent extends PolicyDetailRecapDynamicComponent implements OnInit {

  constructor(
    private kenticoTranslateService: KenticoTranslateService,
    public dataService: DataService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
  }

  isCertificateMissing(policy) {
    return policy.certificateUrl !== CONSTANTS.CERTIFICATE_URL_MISSING;
  }

  openClaim() {
    let kenticoContent = {};
    this.kenticoTranslateService.getItem<any>('modal_rc_scooter_bike_open_claim').pipe().subscribe(item => {
      kenticoContent = item;
      const modalRef = this.modalService.open(ContainerComponent, {size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window'});
      (<ContainerComponent>modalRef.componentInstance).type = 'PolicyDetailModalDoubleClaimScooterBike';
      (<ContainerComponent>modalRef.componentInstance).componentInputData = {'kenticoContent': kenticoContent, 'policyData': this.policy};
    });
  }

}
