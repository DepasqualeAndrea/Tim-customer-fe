import {Component, Input, OnInit} from '@angular/core';
import {Policy} from '../../../private-area.model';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormControl, FormGroup} from '@angular/forms';
import {ContainerComponent} from '../../../../tenants/component-loader/containers/container.component';
import {KenticoTranslateService} from '../../../../kentico/data-layer/kentico-translate.service';
import {DataService, InsurancesService} from '@services';
import { PolicyDetailModalSubmitMultiriskComponent } from '../policy-detail-modal-submit-multirisk/policy-detail-modal-submit-multirisk.component';
@Component({
    selector: 'app-policy-detail-modal-cancellation-multirisk',
    templateUrl: './policy-detail-modal-cancellation-multirisk.component.html',
    styleUrls: ['./policy-detail-modal-cancellation-multirisk.component.scss'],
    standalone: false
})
export class PolicyDetailModalCancellationMultiriskComponent implements OnInit {
 kenticoContent: any;
  @Input() policyData: Policy;
  constructor(public activeModal: NgbActiveModal,
              private kenticoTranslateService: KenticoTranslateService,
              private modalService: NgbModal,
              public dataService: DataService,
              public insuranceService: InsurancesService
  ) {
  }

  ngOnInit(): void {
    this.kenticoTranslateService.getItem<any>('modal_disdetta_polizza').pipe().subscribe(item => {
      this.kenticoContent = item;
    });
  }


  closeModal() {
    this.activeModal.close();
    let kenticoContent = {};
    this.kenticoTranslateService.getItem<any>('modal_submit').pipe().subscribe(item => {
      kenticoContent = item;
      const modalRef = this.modalService.open(ContainerComponent, {size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window'});
      (<ContainerComponent>modalRef.componentInstance).type = 'PolicyModalSubmitMultirisk';
      (<ContainerComponent>modalRef.componentInstance).componentInputData = {'kenticoContent': kenticoContent, 'policyData': this.policyData};
    });
  }


  createRequest() {
    this.insuranceService.deactivate(this.policyData.id).subscribe(() => {
      this.activeModal.close();
      this.openModalSuccess();
    }, (error) => {
      this.activeModal.dismiss();
      throw error;
    });

}

  openModalSuccess(){
    let kenticoContent = {};
    this.kenticoTranslateService.getItem<any>('modal_submit').pipe().subscribe(item => {
    kenticoContent = item;
    let modalRef: any;
    modalRef = this.modalService.open(ContainerComponent, {size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window'});
    (<ContainerComponent>modalRef.componentInstance).type = 'PolicyModalSubmitMultirisk';
    (<ContainerComponent>modalRef.componentInstance).componentInputData = {'kenticoContent': kenticoContent,'policyData': this.policyData};
    });
  }

}
