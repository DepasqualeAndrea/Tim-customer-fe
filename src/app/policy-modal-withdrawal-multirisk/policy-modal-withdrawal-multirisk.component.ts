import { NypInsurancesService } from '@NYP/ngx-multitenant-core';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService, InsurancesService } from '@services';
import { KenticoTranslateService } from 'app/modules/kentico/data-layer/kentico-translate.service';
import { PolicyDetailModalSubmitMultiriskComponent } from 'app/modules/private-area/components/policy-detail/policy-detail-modal-submit-multirisk/policy-detail-modal-submit-multirisk.component';
import { Policy, PolicyAction } from 'app/modules/private-area/private-area.model';
import { ContainerComponent } from 'app/modules/tenants/component-loader/containers/container.component';
import moment from 'moment';

@Component({
  selector: 'app-policy-modal-withdrawal-multirisk',
  templateUrl: './policy-modal-withdrawal-multirisk.component.html',
  styleUrls: ['./policy-modal-withdrawal-multirisk.component.scss']
})
export class PolicyModalWithdrawalMultiriskComponent implements OnInit {

  @Input() kenticoContent: any;
  @Input() policyData: Policy;
  form: FormGroup;

  reason: string;
  startDate: NgbDateStruct;
  endDate: NgbDateStruct;
  yoloEndDate: string;


  constructor(public activeModal: NgbActiveModal,
    public dataService: DataService,
    private modalService: NgbModal,
    private kenticoTranslateService: KenticoTranslateService,
    public insuranceService: InsurancesService,
    protected nypInsurancesService: NypInsurancesService) { }

  ngOnInit(): void {
    console.log(this.kenticoContent)
    this.form = new FormGroup({
      textarea: new FormControl('')
    })
    /*this.startDate = {
      year: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.policyData.startDate, 'DD/MM/YYYY').format('DD')
    };
    this.yoloEndDate = this.dataService.genEndDateYoloWay(this.policyData.expirationDate);
    this.endDate = {
      year: +moment(this.yoloEndDate, 'DD/MM/YYYY').format('YYYY'),
      month: +moment(this.yoloEndDate, 'DD/MM/YYYY').format('MM'),
      day: +moment(this.yoloEndDate, 'DD/MM/YYYY').format('DD')
    };*/
  }


  createRequest() {
    const body = {
      reason: this.form.controls.textarea.value
    };
    this.nypInsurancesService.withdraw(this.policyData.id, body.reason).subscribe(() => {
      this.activeModal.close(this.form.controls.textarea.value);
      this.openModalSuccess();
    }, (error) => {
      this.activeModal.dismiss();
      throw error;
    });
  }

  openModalSuccess() {
    let kenticoContent = {};
    this.kenticoTranslateService.getItem<any>('modal_submit').pipe().subscribe(item => {
      kenticoContent = item;
      let modalRef: any;
      modalRef = this.modalService.open(ContainerComponent, { size: 'lg', backdropClass: 'backdrop-class ' + this.dataService.tenantInfo.main.layout, windowClass: 'modal-window' });
      (<ContainerComponent>modalRef.componentInstance).type = 'PolicyModalSubmitMultirisk';
      (<ContainerComponent>modalRef.componentInstance).componentInputData = { 'kenticoContent': kenticoContent, 'policyData': this.policyData };
    });
  }

}
